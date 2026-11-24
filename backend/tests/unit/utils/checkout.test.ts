import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { catchError } from '../../helpers/catchError.ts';
import {
	applyDiscount,
	parseRequestedTickets,
	priceTickets,
	toStripeAmount,
	type CheckoutEvent,
	type CheckoutItem,
	type RequestedTicket,
} from '../../../utils/checkout.ts';

const EVENT_ID = 'a'.repeat(24);
const OTHER_EVENT_ID = 'b'.repeat(24);

const validProduct = (overrides: Record<string, unknown> = {}) => ({
	eventId: EVENT_ID,
	type: 'normal',
	sector: 'A',
	block: 'blue',
	seating: '12',
	images: ['https://example.com/a.jpg'],
	...overrides,
});

const seatedProducts = (count: number) =>
	Array.from({ length: count }, (_, index) => validProduct({ seating: String(index + 1) }));

describe('parseRequestedTickets', () => {
	it('returns a normalized ticket for a valid product', () => {
		const result = parseRequestedTickets([validProduct()]);
		const expected = [
			{
				eventId: EVENT_ID,
				type: 'normal',
				sector: 'A',
				block: 'blue',
				seating: '12',
				images: ['https://example.com/a.jpg'],
			},
		];

		expect(result).toEqual(expected);
	});

	it('ignores fields the client should not control (e.g. price)', () => {
		const [result] = parseRequestedTickets([validProduct({ price: 1, name: 'Hacked' })]);
		const expected = {
			eventId: EVENT_ID,
			type: 'normal',
			sector: 'A',
			block: 'blue',
			seating: '12',
			images: ['https://example.com/a.jpg'],
		};

		expect(result).toStrictEqual(expected);
	});

	it.each([
		['not an array', 'abc'],
		['an empty array', []],
		['more than 20 tickets', seatedProducts(21)],
	])('rejects %s', (_label, products) => {
		const result = catchError(() => parseRequestedTickets(products));
		const expected = { statusCode: 400, message: 'Zamówienie musi zawierać od 1 do 20 biletów' };

		expect(result).toMatchObject(expected);
	});

	it('accepts exactly 20 tickets', () => {
		const result = parseRequestedTickets(seatedProducts(20));
		const expected = 20;

		expect(result).toHaveLength(expected);
	});

	it.each([
		['null item', null, 'nieprawidłowe dane'],
		['string item', 'ticket', 'nieprawidłowe dane'],
		['invalid eventId', validProduct({ eventId: 'not-an-id' }), 'nieprawidłowe wydarzenie'],
		['numeric eventId', validProduct({ eventId: 123 }), 'nieprawidłowe wydarzenie'],
		['unknown ticket type', validProduct({ type: 'senior' }), 'nieprawidłowy typ biletu'],
		['unknown sector', validProduct({ sector: 'Z' }), 'nieprawidłowy sektor'],
		['unknown block', validProduct({ block: 'red' }), 'nieprawidłowa strefa'],
		['seat 0', validProduct({ seating: '0' }), 'nieprawidłowe miejsce'],
		['seat above hall capacity', validProduct({ seating: '101' }), 'nieprawidłowe miejsce'],
		['non-numeric seat', validProduct({ seating: '1a' }), 'nieprawidłowe miejsce'],
		['negative seat', validProduct({ seating: '-1' }), 'nieprawidłowe miejsce'],
		['fractional seat', validProduct({ seating: '1.5' }), 'nieprawidłowe miejsce'],
	])('rejects a ticket with %s', (_label, product, reason) => {
		const result = catchError(() => parseRequestedTickets([product]));
		const expected = { statusCode: 400, message: `Bilet 1: ${reason}` };

		expect(result).toMatchObject(expected);
	});

	it('reports the position of the invalid ticket', () => {
		const result = catchError(() => parseRequestedTickets([validProduct(), validProduct({ type: 'x' })]));
		const expected = { statusCode: 400, message: 'Bilet 2: nieprawidłowy typ biletu' };

		expect(result).toMatchObject(expected);
	});

	it.each([undefined, null, ''])('treats seating %s as a ticket without a seat', seating => {
		const [result] = parseRequestedTickets([validProduct({ seating })]);
		const expected = '';

		expect(result.seating).toBe(expected);
	});

	it('accepts a numeric seat and stores it as a string', () => {
		const [result] = parseRequestedTickets([validProduct({ seating: 100 })]);
		const expected = '100';

		expect(result.seating).toBe(expected);
	});

	it('rejects the same seat chosen twice', () => {
		const result = catchError(() =>
			parseRequestedTickets([validProduct({ seating: '5' }), validProduct({ seating: 5 })]),
		);
		const expected = { statusCode: 400, message: 'Bilet 2: to samo miejsce zostało wybrane dwa razy' };

		expect(result).toMatchObject(expected);
	});

	it('allows the same seat number in different events, sectors or blocks', () => {
		const products = [
			validProduct({ seating: '5' }),
			validProduct({ seating: '5', eventId: OTHER_EVENT_ID }),
			validProduct({ seating: '5', sector: 'B' }),
			validProduct({ seating: '5', block: 'green' }),
		];

		const result = parseRequestedTickets(products);
		const expected = 4;

		expect(result).toHaveLength(expected);
	});

	it('allows several tickets without a seat', () => {
		const result = parseRequestedTickets([validProduct({ seating: '' }), validProduct({ seating: '' })]);
		const expected = 2;

		expect(result).toHaveLength(expected);
	});

	it('keeps only the first http(s) image and drops other values', () => {
		const [result] = parseRequestedTickets([
			validProduct({ images: ['javascript:alert(1)', 42, 'http://a.pl/1.png', 'https://a.pl/2.png'] }),
		]);
		const expected = ['http://a.pl/1.png'];

		expect(result.images).toEqual(expected);
	});

	it('returns no images when images is not an array', () => {
		const [result] = parseRequestedTickets([validProduct({ images: 'https://a.pl/1.png' })]);
		const expected: string[] = [];

		expect(result.images).toEqual(expected);
	});
});

describe('priceTickets', () => {
	const NOW = new Date('2026-01-01T12:00:00Z');
	const DAY_MS = 24 * 60 * 60 * 1000;

	const ticket = (overrides: Partial<RequestedTicket> = {}): RequestedTicket => ({
		eventId: EVENT_ID,
		type: 'normal',
		sector: 'A',
		block: 'blue',
		seating: '1',
		images: [],
		...overrides,
	});

	const event = (overrides: Partial<CheckoutEvent> = {}): CheckoutEvent => ({
		name: 'Koncert',
		date: new Date(NOW.getTime() + 40 * DAY_MS), // 30-59 days -> 10% discount
		prices: { normal: 100, VIP: 300, child: 50 },
		sectors: ['A', 'B'],
		seatRequired: true,
		...overrides,
	});

	const eventsMap = (checkoutEvent: CheckoutEvent = event()) => new Map([[EVENT_ID, checkoutEvent]]);

	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('prices tickets from the event data with the time-based discount', () => {
		const result = priceTickets(
			[ticket(), ticket({ type: 'VIP', seating: '2' }), ticket({ type: 'child', seating: '3' })],
			eventsMap(),
		);
		const expected = [
			{ ...ticket(), name: 'Koncert', date: event().date, price: 90 },
			{ ...ticket({ type: 'VIP', seating: '2' }), name: 'Koncert', date: event().date, price: 270 },
			{ ...ticket({ type: 'child', seating: '3' }), name: 'Koncert', date: event().date, price: 45 },
		];

		expect(result).toEqual(expected);
	});

	it('throws 404 when the event does not exist', () => {
		const result = catchError(() => priceTickets([ticket()], new Map()));
		const expected = { statusCode: 404, message: 'Bilet 1: nie znaleziono wydarzenia' };

		expect(result).toMatchObject(expected);
	});

	it('throws 400 when the event already took place', () => {
		const result = catchError(() => priceTickets([ticket()], eventsMap(event({ date: NOW }))));
		const expected = { statusCode: 400, message: 'Bilet 1: wydarzenie już się odbyło' };

		expect(result).toMatchObject(expected);
	});

	it('throws 400 when the sector is not available for the event', () => {
		const result = catchError(() => priceTickets([ticket({ sector: 'C' })], eventsMap()));
		const expected = { statusCode: 400, message: 'Bilet 1: sektor C nie jest dostępny dla tego wydarzenia' };

		expect(result).toMatchObject(expected);
	});

	it('throws 400 when the event requires a seat and none was chosen', () => {
		const result = catchError(() => priceTickets([ticket({ seating: '' })], eventsMap()));
		const expected = { statusCode: 400, message: 'Bilet 1: to wydarzenie wymaga wyboru miejsca' };

		expect(result).toMatchObject(expected);
	});

	it('allows tickets without a seat when the event does not require one', () => {
		const [result] = priceTickets([ticket({ seating: '' })], eventsMap(event({ seatRequired: false })));
		const expected = 90;

		expect(result.price).toBe(expected);
	});

	it.each([
		['a zero price', 'VIP'],
		['no price at all', 'child'],
	] as const)('throws 400 when the ticket type has %s', (_label, type) => {
		const events = eventsMap(event({ prices: { normal: 100, VIP: 0 } }));

		const result = catchError(() => priceTickets([ticket({ type })], events));
		const expected = { statusCode: 400, message: 'Cena biletu "Koncert" musi być liczbą dodatnią' };

		expect(result).toMatchObject(expected);
	});
});

describe('applyDiscount', () => {
	const item = (price: number): CheckoutItem => ({
		eventId: EVENT_ID,
		type: 'normal',
		sector: 'A',
		block: 'blue',
		seating: '1',
		images: [],
		name: 'Koncert',
		date: new Date('2026-06-01'),
		price,
	});

	it('reduces each price by the code value and rounds to grosze', () => {
		const result = applyDiscount([item(100), item(33.33)], 0.2);
		const expected = [item(80), item(26.66)];

		expect(result).toEqual(expected);
	});

	it('does not mutate the original items', () => {
		const items = [item(100)];

		applyDiscount(items, 0.5);
		const result = items;
		const expected = [item(100)];

		expect(result).toEqual(expected);
	});

	it.each([
		[0, 99.99],
		[1, 0],
	])('handles a discount of %s', (value, expected) => {
		const [result] = applyDiscount([item(99.99)], value);

		expect(result.price).toBe(expected);
	});
});

describe('toStripeAmount', () => {
	it.each([
		[10, 1000],
		[19.99, 1999],
		[0.1 + 0.2, 30],
		[1.005, 100],
		[0, 0],
	])('converts %s PLN to %s grosze', (price, expected) => {
		const result = toStripeAmount(price);

		expect(result).toBe(expected);
	});
});
