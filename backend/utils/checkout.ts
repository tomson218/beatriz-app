import { calcDiscountPrice, calcPricesAfterDiscount } from './discounts.ts';
import { validatePositiveNumber } from './validateNumbers.ts';
import { SECTORS } from '@beatriz/shared/enums/sectors';
import { BLOCK_TYPES } from '@beatriz/shared/enums/blockTypes';
import { TICKET_TYPES } from '@beatriz/shared/enums/ticketTypes';
import { COUNT_SEAT } from '@beatriz/shared/constants/hallCapacity';

/**
 * Cena biletu NIGDY nie pochodzi od klienta. Z żądania bierzemy wyłącznie to, CO klient chce kupić
 * (wydarzenie, typ biletu, sektor, strefa, miejsce), a cenę wyliczamy z danych wydarzenia w bazie.
 */

const MAX_TICKETS_PER_ORDER = 20;
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;
const SEAT_REGEX = /^\d+$/;

export interface RequestedTicket {
	eventId: string;
	type: (typeof TICKET_TYPES)[number];
	sector: string;
	block: (typeof BLOCK_TYPES)[number];
	/** Pusty string oznacza bilet bez numerowanego miejsca. */
	seating: string;
	images: string[];
}

export interface CheckoutEvent {
	name: string;
	date: Date;
	prices: Record<string, number>;
	sectors: string[];
	seatRequired: boolean;
}

export interface CheckoutItem extends RequestedTicket {
	name: string;
	date: Date;
	price: number;
}

const isOneOf = <T extends readonly string[]>(list: T, value: unknown): value is T[number] =>
	typeof value === 'string' && (list as readonly string[]).includes(value);

export const parseRequestedTickets = (products: unknown): RequestedTicket[] => {
	if (!Array.isArray(products) || products.length === 0 || products.length > MAX_TICKETS_PER_ORDER) {
		throw Object.assign(new Error(`Zamówienie musi zawierać od 1 do ${MAX_TICKETS_PER_ORDER} biletów`), { statusCode: 400 });
	}

	const seenSeats = new Set<string>();

	return products.map((raw: unknown, index: number): RequestedTicket => {
		const position = `Bilet ${index + 1}`;

		if (typeof raw !== 'object' || raw === null) {
			throw Object.assign(new Error(`${position}: nieprawidłowe dane`), { statusCode: 400 });
		}

		const product = raw as Record<string, unknown>;

		if (typeof product.eventId !== 'string' || !OBJECT_ID_REGEX.test(product.eventId)) {
			throw Object.assign(new Error(`${position}: nieprawidłowe wydarzenie`), { statusCode: 400 });
		}
		if (!isOneOf(TICKET_TYPES, product.type)) {
			throw Object.assign(new Error(`${position}: nieprawidłowy typ biletu`), { statusCode: 400 });
		}
		if (!isOneOf(SECTORS, product.sector)) {
			throw Object.assign(new Error(`${position}: nieprawidłowy sektor`), { statusCode: 400 });
		}
		if (!isOneOf(BLOCK_TYPES, product.block)) {
			throw Object.assign(new Error(`${position}: nieprawidłowa strefa`), { statusCode: 400 });
		}

		let seating = '';
		if (product.seating !== undefined && product.seating !== null && product.seating !== '') {
			seating = String(product.seating);
			const seat = Number(seating);
			if (!SEAT_REGEX.test(seating) || seat < 1 || seat > COUNT_SEAT) {
				throw Object.assign(new Error(`${position}: nieprawidłowe miejsce`), { statusCode: 400 });
			}

			const seatKey = `${product.eventId}|${product.sector}|${product.block}|${seat}`;
			if (seenSeats.has(seatKey)) {
				throw Object.assign(new Error(`${position}: to samo miejsce zostało wybrane dwa razy`), { statusCode: 400 });
			}
			seenSeats.add(seatKey);
		}

		// Obrazki służą tylko do wyświetlenia w Stripe, nie mają wpływu na cenę.
		const images = Array.isArray(product.images)
			? product.images
					.filter((image): image is string => typeof image === 'string' && /^https?:\/\//.test(image))
					.slice(0, 1)
			: [];

		return {
			eventId: product.eventId,
			type: product.type,
			sector: product.sector,
			block: product.block,
			seating,
			images,
		};
	});
};

export const priceTickets = (tickets: RequestedTicket[], events: Map<string, CheckoutEvent>): CheckoutItem[] =>
	tickets.map((ticket, index): CheckoutItem => {
		const position = `Bilet ${index + 1}`;
		const event = events.get(ticket.eventId);

		if (!event) {
			throw Object.assign(new Error(`${position}: nie znaleziono wydarzenia`), { statusCode: 404 });
		}
		if (new Date(event.date).getTime() <= Date.now()) {
			throw Object.assign(new Error(`${position}: wydarzenie już się odbyło`), { statusCode: 400 });
		}
		if (!event.sectors.includes(ticket.sector)) {
			throw Object.assign(new Error(`${position}: sektor ${ticket.sector} nie jest dostępny dla tego wydarzenia`), { statusCode: 400 });
		}
		if (event.seatRequired && ticket.seating === '') {
			throw Object.assign(new Error(`${position}: to wydarzenie wymaga wyboru miejsca`), { statusCode: 400 });
		}

		const prices: Record<string, number> = calcPricesAfterDiscount(calcDiscountPrice(event.date), event.prices);
		const price = prices[ticket.type];

		validatePositiveNumber(price, `Cena biletu "${event.name}"`);

		return { ...ticket, name: event.name, date: event.date, price };
	});

/** @param value Wartość rabatu z kodu: ułamek od 0 do 1 (np. 0.2 = -20%). */
export const applyDiscount = (items: CheckoutItem[], value: number): CheckoutItem[] =>
	items.map(item => ({ ...item, price: Math.round(item.price * (1 - value) * 100) / 100 }));

/** Stripe liczy w groszach i wymaga liczb całkowitych. */
export const toStripeAmount = (price: number): number => Math.round(price * 100);
