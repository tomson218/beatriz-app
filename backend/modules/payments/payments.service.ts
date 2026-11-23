import type Stripe from 'stripe';
import type { Types } from 'mongoose';
import UserModel from '../users/users.model.ts';
import EventModel from '../events/events.model.ts';
import OrderModel from '../orders/orders.model.ts';
import TicketModel from '../tickets/tickets.model.ts';
import { sendEmail } from '../../utils/email.ts';
import { generatePDF } from '../../utils/pdfGenerator.ts';
import { formattedDate, formattedTime } from '../../utils/formattingDate.ts';
import {
	applyDiscount,
	parseRequestedTickets,
	priceTickets,
	toStripeAmount,
	type CheckoutEvent,
	type CheckoutItem,
	type RequestedTicket,
} from '../../utils/checkout.ts';
import { getUsableDiscountCode } from '../discountCodes/discountCodes.service.ts';
import { stripe } from './payments.stripe.ts';
import type { UserDocument } from '../users/users.type.ts';
import type { DiscountCodeDocument } from '../discountCodes/discountCodes.type.ts';
import type { CheckoutRequestBody, PdfTicket, PreparedCheckout } from './payments.type.ts';

const normalizeDiscountCode = (value: unknown): string => (typeof value === 'string' ? value.trim() : '');

const loadCheckoutEvents = async (eventIds: string[]): Promise<Map<string, CheckoutEvent>> => {
	const events = await EventModel.find({ _id: { $in: eventIds } })
		.select('name date prices sectors seatRequired')
		.lean();

	return new Map(events.map(event => [event._id.toString(), event as unknown as CheckoutEvent]));
};

/** Odrzuca zamówienie, gdy któreś z miejsc jest już sprzedane albo zarezerwowane do wpłaty offline. */
const assertSeatsAreFree = async (tickets: RequestedTicket[]): Promise<void> => {
	const seatedTickets: RequestedTicket[] = tickets.filter(ticket => ticket.seating !== '');

	const takenFlags = await Promise.all(
		seatedTickets.map(({ eventId, sector, block, seating }) =>
			TicketModel.exists({
				eventId,
				'seating.sector': sector,
				'seating.block': block,
				'seating.seat': Number(seating),
			}),
		),
	);

	const takenTicket: RequestedTicket | undefined = seatedTickets.find((_, index) => takenFlags[index]);

	if (takenTicket) {
		throw Object.assign(new Error(`Miejsce ${takenTicket.seating} w sektorze ${takenTicket.sector} jest już zajęte`), { statusCode: 409 });
	}
};

/** Sprawdza żądanie i wylicza ceny po stronie serwera. Wspólne dla płatności online i offline. */
export const prepareCheckout = async (user: UserDocument, body: CheckoutRequestBody): Promise<PreparedCheckout> => {
	const requestedTickets: RequestedTicket[] = parseRequestedTickets(body.products);

	await assertSeatsAreFree(requestedTickets);

	const eventIds: string[] = [...new Set(requestedTickets.map(ticket => ticket.eventId))];
	const eventsById: Map<string, CheckoutEvent> = await loadCheckoutEvents(eventIds);

	let items: CheckoutItem[] = priceTickets(requestedTickets, eventsById);

	const discountCode: string = normalizeDiscountCode(body.discountCode);

	if (discountCode) {
		const subtotal: number = items.reduce((sum, item) => sum + item.price, 0);
		const code: DiscountCodeDocument = await getUsableDiscountCode(discountCode, subtotal, user);

		items = applyDiscount(items, code.value);
	}

	return { items, discountCode };
};

export const calcTotalAmount = (items: CheckoutItem[]): number => {
	const total: number = items.reduce((sum, item) => sum + Number(item.price), 0);

	return Math.round(total * 100) / 100;
};

const toSeating = ({ sector, block, seating }: CheckoutItem) => ({
	sector,
	block,
	seat: seating !== '' ? Number(seating) : undefined,
});

export const buildOrderTickets = (items: CheckoutItem[]) => {
	return items.map(item => ({
		eventId: item.eventId,
		seating: [toSeating(item)],
		price: item.price,
		type: item.type,
	}));
};

export const buildTickets = (
	items: CheckoutItem[],
	userId: Types.ObjectId,
	extraFields: { orderId?: Types.ObjectId; status?: 'pending' | 'active' } = {},
) => {
	return items.map(item => ({
		eventId: item.eventId,
		type: item.type,
		price: item.price,
		quantity: 1,
		seating: toSeating(item),
		userId,
		date: new Date(),
		...extraFields,
	}));
};

const toStripeLineItem = ({ name, date, images, price, seating, sector, block }: CheckoutItem) => {
	const eventDate: Date = new Date(date);

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
 * Zatwierdzony koszyk trafia do `myCart`, którego klient nie może zmienić;
 * webhook po opłaceniu zamówienia czyta bilety wyłącznie stąd.
 */
export const createCheckoutSession = async (user: UserDocument, body: CheckoutRequestBody): Promise<string | null> => {
	const { items, discountCode }: PreparedCheckout = await prepareCheckout(user, body);

	await UserModel.findByIdAndUpdate(user._id, { myCart: items });

	const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
		line_items: items.map(toStripeLineItem),
		mode: 'payment',
		success_url: `${process.env.CLIENT_URL}/success`,
		cancel_url: `${process.env.CLIENT_URL}/cancel`,
		metadata: {
			userId: JSON.stringify(user._id),
			discountCode: JSON.stringify(discountCode || null),
		},
	});

	return session.url;
};

const buildOrderConfirmationMessage = (totalAmount: number, currency: string): string =>
	`<p>Dziękujęmy za złożenie zamówienia na kwotę ${totalAmount} ${currency}. W załączniku znajduje się plik bilety.pdf, który zawiera listę zakupionych biletów oraz szczegóły dotyczące wydarzenia.</p> <p>Pozdrawiamy</p> <p>Zespół aplikacji Beatriz App</p>`;

export const sendOrderConfirmation = async (
	email: string,
	totalAmount: number,
	currency: string,
	tickets: PdfTicket[],
): Promise<void> => {
	const pdfContent: Buffer = await generatePDF(tickets);

	await sendEmail({
		email,
		subject: 'Złożenie zamówienia',
		html: buildOrderConfirmationMessage(totalAmount, currency),
		attachments: [{ filename: 'bilety.pdf', content: pdfContent, contentType: 'application/pdf' }],
	});
};

/**
 * Realizuje opłacone zamówienie: zapisuje zamówienie i bilety, wysyła potwierdzenie z PDF-em i czyści koszyk.
 * Gdy nie ma zatwierdzonego koszyka (np. powtórzone zdarzenie), nic nie robi.
 * Błąd wysyłki maila kończy się wyjątkiem ze `statusCode` 500.
 */
export const fulfillCheckoutSession = async (session: Stripe.Checkout.Session): Promise<void> => {
	const metadata = session.metadata as Record<string, string>;
	const user = (await UserModel.findById(JSON.parse(metadata.userId)).select('+myCart')) as UserDocument | null;

	if (!user) {
		console.warn(`Checkout session ${session.id}: user not found, skipping.`);
		return;
	}

	const usedDiscountCode: string | null = JSON.parse(metadata.discountCode);
	const appliedDiscount = user.appliedDiscountCodes.find(applied => applied.code === usedDiscountCode);

	if (appliedDiscount) {
		appliedDiscount.isUsed = true;
		await user.save();
	}

	const cart = user.myCart as CheckoutItem[];

	if (!cart?.length) {
		console.warn(`Checkout session ${session.id}: no approved cart, skipping.`);
		return;
	}

	const totalAmount: number = calcTotalAmount(cart);
	const currency = 'PLN';

	await OrderModel.create({
		totalAmount,
		date: new Date(),
		userId: user._id,
		currency,
		tickets: buildOrderTickets(cart),
		countOfTickets: cart.length,
	});

	await TicketModel.insertMany(buildTickets(cart, user._id));

	try {
		await sendOrderConfirmation(user.email, totalAmount, currency, cart);
	} catch {
		throw Object.assign(new Error('Problem with sending an email.'), { statusCode: 500 });
	}

	await UserModel.findByIdAndUpdate(user._id, { cart: [], myCart: [] });
};
