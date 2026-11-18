import OrderModel from './orders.model.ts';
import TicketModel from '../tickets/tickets.model.ts';
import UserModel from '../users/users.model.ts';
import {
	buildOrderTickets,
	buildTickets,
	calcTotalAmount,
	prepareCheckout,
	sendOrderConfirmation,
} from '../payments/payments.service.ts';
import { getOverdueOrderDate } from '../../utils/offlinePayment.ts';
import { ORDER_STATUSES } from '@beatriz/shared/enums/orderStatuses';
import type { OrderStatus, UpdateOrderStatusRequest } from '@beatriz/shared/orders';
import type { CheckoutRequestBody, PdfTicket, PreparedCheckout } from '../payments/payments.type.ts';
import type { UserDocument } from '../users/users.type.ts';
import type { OrderDocument } from './orders.type.ts';

const isOrderStatus = (value: unknown): value is OrderStatus => ORDER_STATUSES.includes(value as OrderStatus);

export const parseOrderStatus = (value: unknown): OrderStatus | undefined => {
	if (value === undefined) return undefined;

	if (!isOrderStatus(value)) {
		throw Object.assign(new Error(`Invalid order status: ${String(value)}`), { statusCode: 400 });
	}

	return value;
};

export const parseOrderDecision = (value: unknown): UpdateOrderStatusRequest['status'] => {
	if (value !== 'paid' && value !== 'rejected') {
		throw Object.assign(new Error('Order status must be "paid" or "rejected".'), { statusCode: 400 });
	}

	return value;
};

export const findAllOrders = async (status?: OrderStatus): Promise<OrderDocument[]> => {
	// Zamówienia sprzed płatności offline nie mają statusu, a wszystkie były opłacone online.
	const paidFilter = { status: { $in: ['paid', null] } };
	const filter = status === 'paid' ? paidFilter : status ? { status } : {};

	return OrderModel.find(filter)
		.select('-__v')
		.populate('user', 'username email')
		.populate('tickets.event', 'name date')
		.sort({ date: -1 })
		.exec();
};

export const findOrdersOfUser = async (userId: string): Promise<OrderDocument[]> => {
	return OrderModel.find({ userId }).select('-__v').populate('tickets.event').sort({ date: -1 }).exec();
};

/** Tworzy zamówienie czekające na wpłatę. Miejsca są zarezerwowane biletami o statusie `pending`. */
export const createOfflineOrder = async (user: UserDocument, body: CheckoutRequestBody): Promise<OrderDocument> => {
	const { items, discountCode }: PreparedCheckout = await prepareCheckout(user, body);

	const order: OrderDocument = await OrderModel.create({
		totalAmount: calcTotalAmount(items),
		date: new Date(),
		userId: user._id,
		currency: 'PLN',
		tickets: buildOrderTickets(items),
		countOfTickets: items.length,
		paymentMethod: 'offline',
		status: 'pending',
		discountCode: discountCode || undefined,
	});

	await TicketModel.insertMany(buildTickets(items, user._id, { orderId: order._id, status: 'pending' }));

	return order;
};

const toPdfTickets = (order: OrderDocument): PdfTicket[] => {
	return order.tickets.map((ticket): PdfTicket => {
		const event = (ticket as unknown as { event?: { name: string; date: Date } }).event;
		const seating = ticket.seating[0];

		return {
			name: event?.name,
			date: event?.date,
			sector: seating?.sector,
			block: seating?.block,
			seating: seating?.seat,
			price: ticket.price,
			type: ticket.type,
		};
	});
};

/** Po zatwierdzeniu wpłaty oznacza kod rabatowy jako użyty, czyści koszyk i wysyła bilety. */
const completeOfflinePayment = async (order: OrderDocument): Promise<void> => {
	const user: UserDocument | null = await UserModel.findById(order.userId);

	if (!user) return;

	const appliedDiscount = user.appliedDiscountCodes.find(applied => applied.code === order.discountCode);

	if (appliedDiscount) appliedDiscount.isUsed = true;

	user.cart = [];
	await user.save({ validateBeforeSave: false });

	// Wpłata jest już zatwierdzona, więc błąd wysyłki maila nie może cofnąć decyzji administratora.
	await sendOrderConfirmation(user.email, order.totalAmount, order.currency, toPdfTickets(order)).catch((error: unknown) =>
		console.error(`Order ${order._id}: confirmation email could not be sent:`, error),
	);
};

/** Oznacza nieopłacone na czas zamówienia offline jako wygasłe i zwalnia ich miejsca. */
export const expireOverdueOfflineOrders = async (): Promise<number> => {
	const overdueOrders = await OrderModel.find({
		paymentMethod: 'offline',
		status: 'pending',
		date: { $lte: getOverdueOrderDate() },
	}).select('_id');

	let expiredCount: number = 0;

	for (const { _id: orderId } of overdueOrders) {
		// Warunek na status chroni przed wygaszeniem zamówienia, które admin właśnie zatwierdził.
		const expiredOrder = await OrderModel.findOneAndUpdate({ _id: orderId, status: 'pending' }, { status: 'expired' });

		if (expiredOrder) {
			await TicketModel.deleteMany({ orderId });
			expiredCount += 1;
		}
	}

	return expiredCount;
};

/** Zatwierdza albo odrzuca wpłatę offline. Odrzucenie zwalnia zarezerwowane miejsca. */
export const resolveOfflineOrder = async (
	orderId: string,
	decision: UpdateOrderStatusRequest['status'],
): Promise<OrderDocument> => {
	const order: OrderDocument | null = await OrderModel.findOneAndUpdate(
		{ _id: orderId, paymentMethod: 'offline', status: 'pending', date: { $gt: getOverdueOrderDate() } },
		{ status: decision },
		{ new: true },
	).populate('tickets.event', 'name date');

	if (!order) {
		const orderExists = await OrderModel.exists({ _id: orderId });

		throw orderExists
			? Object.assign(new Error('This order is not waiting for an offline payment.'), { statusCode: 409 })
			: Object.assign(new Error('No order found with that ID'), { statusCode: 404 });
	}

	if (decision === 'rejected') {
		await TicketModel.deleteMany({ orderId });

		return order;
	}

	await TicketModel.updateMany({ orderId }, { status: 'active' });
	await completeOfflinePayment(order);

	return order;
};
