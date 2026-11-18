import type Stripe from 'stripe';
import UserModel from '../models/userModel.ts';
import EventModel from '../models/eventModel.ts';
import OrderModel from '../models/orderModel.ts';
import TicketModel from '../models/ticketModel.ts';
import AppError from '../utils/appError.ts';
import { sendEmail } from '../utils/email.ts';
import { generatePDF } from '../utils/pdfGenerator.ts';
import { formattedDate, formattedTime } from '../utils/formattingDate.ts';
import {
	applyDiscount,
	parseRequestedTickets,
	priceTickets,
	toStripeAmount,
	type CheckoutEvent,
	type CheckoutItem,
} from '../utils/checkout.ts';
import { getUsableDiscountCode } from './discountCodeService.ts';
import { stripe } from './stripeClient.ts';
import type { User } from '@beatriz/shared/users';

/** Treść żądania utworzenia sesji płatności. Z `products` bierzemy tylko to, CO klient kupuje: ceny liczy serwer. */
interface CheckoutRequestBody {
	products: unknown;
	discountCode?: unknown;
}

/** Zatwierdzony koszyk zapisany w `myCart` (pozycje z cenami wyliczonymi na serwerze). */
type ApprovedCartItem = CheckoutItem;

const normalizeDiscountCode = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const loadCheckoutEvents = async (eventIds: string[]): Promise<Map<string, CheckoutEvent>> => {
	const events = await EventModel.find({ _id: { $in: eventIds } })
		.select('name date prices sectors seatRequired')
		.lean();

	return new Map(events.map(event => [event._id.toString(), event as unknown as CheckoutEvent]));
};

const toStripeLineItem = ({ name, date, images, price, seating, sector, block }: CheckoutItem) => {
	const eventDate = new Date(date);

	return {
		price_data: {
			currency: 'pln',
			product_data: {
				name: `${name} - ${formattedDate(eventDate)} ${formattedTime(eventDate)}`,
				images: images.length > 0 ? images : undefined,
				description: `sektor: ${sector} strefa: ${block} ${seating ? `miejsce: ${seating}` : ''}`,
			},
			unit_amount: toStripeAmount(price),
		},
		quantity: 1,
	};
};

/**
 * Tworzy sesję płatności Stripe i zwraca jej adres.
 * Zatwierdzony koszyk trafia do `myCart`, którego klient nie może zmienić (`cart` można nadpisać przez /users/addCart);
 * webhook po opłaceniu zamówienia czyta bilety wyłącznie stąd.
 */
export const createCheckoutSession = async (user: User, body: CheckoutRequestBody): Promise<string | null> => {
	const requestedTickets = parseRequestedTickets(body.products);

	const eventIds = [...new Set(requestedTickets.map(ticket => ticket.eventId))];
	const eventsById = await loadCheckoutEvents(eventIds);

	let items: CheckoutItem[] = priceTickets(requestedTickets, eventsById);

	const discountCode = normalizeDiscountCode(body.discountCode);

	if (discountCode) {
		const subtotal = items.reduce((sum, item) => sum + item.price, 0);
		const code = await getUsableDiscountCode(discountCode, subtotal, user);

		items = applyDiscount(items, code.value);
	}

	await UserModel.findByIdAndUpdate(user.id, { myCart: items });

	const session = await stripe.checkout.sessions.create({
		line_items: items.map(toStripeLineItem),
		mode: 'payment',
		success_url: `${process.env.CLIENT_URL}/success`,
		cancel_url: `${process.env.CLIENT_URL}/cancel`,
		metadata: {
			userId: JSON.stringify(user.id),
			discountCode: JSON.stringify(discountCode || null),
		},
	});

	return session.url;
};

const buildTicketsFromCart = (cart: ApprovedCartItem[], userId: User['_id']) => {
	return cart.map(item => ({
		event: item.eventId,
		type: item.type,
		price: item.price,
		quantity: 1,
		seating: {
			sector: item.sector,
			block: item.block,
			seat: item.seating !== '' ? item.seating : undefined,
		},
		user: userId,
		date: new Date(),
	}));
};

const buildOrderConfirmationMessage = (totalAmount: number, currency: string): string =>
	`<p>Dziękujęmy za złożenie zamówienia na kwotę ${totalAmount} ${currency}. W załączniku znajduje się plik bilety.pdf, który zawiera listę zakupionych biletów oraz szczegóły dotyczące wydarzenia.</p> <p>Pozdrawiamy</p> <p>Zespół aplikacji Beatriz App</p>`;

/**
 * Realizuje opłacone zamówienie: zapisuje zamówienie i bilety, wysyła potwierdzenie z PDF-em i czyści koszyk.
 * Gdy nie ma zatwierdzonego koszyka (np. powtórzone zdarzenie), nic nie robi.
 * Błąd wysyłki maila kończy się wyjątkiem `AppError` (500).
 */
export const fulfillCheckoutSession = async (session: Stripe.Checkout.Session): Promise<void> => {
	const user = await UserModel.findById(JSON.parse(session.metadata.userId)).select('+myCart');
	const usedDiscountCode = JSON.parse(session.metadata.discountCode);

	const appliedDiscount = user.appliedDiscountCodes.find(applied => applied.code === usedDiscountCode);

	if (appliedDiscount) {
		appliedDiscount.isUsed = true;
		await user.save();
	}

	const cart: ApprovedCartItem[] = user.myCart;

	if (!cart?.length) {
		console.warn(`Checkout session ${session.id}: no approved cart, skipping.`);
		return;
	}

	const totalAmount = cart.reduce((sum, item) => sum + Number(item.price), 0);

	const order = await OrderModel.create({
		totalAmount,
		date: new Date(),
		user: user._id,
		currency: 'PLN',
		tickets: cart,
		countOfTickets: cart.length,
	});

	await Promise.all(buildTicketsFromCart(cart, user._id).map(ticket => TicketModel.create(ticket)));

	const pdfContent = await generatePDF(cart);

	try {
		await sendEmail({
			email: user.email,
			subject: 'Złożenie zamówienia',
			html: buildOrderConfirmationMessage(order.totalAmount, order.currency),
			attachments: [{ filename: 'bilety.pdf', content: pdfContent, contentType: 'application/pdf' }],
		});
	} catch {
		throw new AppError('Problem with sending an email.', 500);
	}

	await UserModel.findByIdAndUpdate(user._id, { cart: [], myCart: [] });
};
