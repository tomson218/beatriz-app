import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type Stripe from 'stripe';
import UserModel from '../../../../modules/users/users.model.ts';
import EventModel from '../../../../modules/events/events.model.ts';
import OrderModel from '../../../../modules/orders/orders.model.ts';
import TicketModel from '../../../../modules/tickets/tickets.model.ts';
import { sendEmail } from '../../../../utils/email.ts';
import { generatePDF } from '../../../../utils/pdfGenerator.ts';
import { getUsableDiscountCode } from '../../../../modules/discountCodes/discountCodes.service.ts';
import { stripe } from '../../../../modules/payments/payments.stripe.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { catchAsyncError } from '../../../helpers/catchError.ts';
import type { CheckoutItem } from '../../../../utils/checkout.ts';
import {
	buildOrderTickets,
	buildTickets,
	calcTotalAmount,
	createCheckoutSession,
	fulfillCheckoutSession,
	prepareCheckout,
	sendOrderConfirmation,
} from '../../../../modules/payments/payments.service.ts';

vi.mock('../../../../modules/users/users.model.ts', () => ({ default: { findById: vi.fn(), findByIdAndUpdate: vi.fn() } }));
vi.mock('../../../../modules/events/events.model.ts', () => ({ default: { find: vi.fn() } }));
vi.mock('../../../../modules/orders/orders.model.ts', () => ({ default: { create: vi.fn() } }));
vi.mock('../../../../modules/tickets/tickets.model.ts', () => ({ default: { exists: vi.fn(), insertMany: vi.fn() } }));
vi.mock('../../../../utils/email.ts', () => ({ sendEmail: vi.fn() }));
vi.mock('../../../../utils/pdfGenerator.ts', () => ({ generatePDF: vi.fn() }));
vi.mock('../../../../modules/discountCodes/discountCodes.service.ts', () => ({ getUsableDiscountCode: vi.fn() }));
vi.mock('../../../../modules/payments/payments.stripe.ts', () => ({ stripe: { checkout: { sessions: { create: vi.fn() } } } }));

const User = vi.mocked(UserModel);
const Event = vi.mocked(EventModel);
const Order = vi.mocked(OrderModel);
const Ticket = vi.mocked(TicketModel);
const createStripeSession = vi.mocked(stripe.checkout.sessions.create);
const sessionParams = (call = 0) => createStripeSession.mock.calls[call][0] as Stripe.Checkout.SessionCreateParams;

const NOW = new Date('2026-01-01T12:00:00Z');
const DAY_MS = 24 * 60 * 60 * 1000;
const EVENT_ID = 'a'.repeat(24);
const USER_ID = { toString: () => 'user-1' } as never;
const EVENT_DATE = new Date(NOW.getTime() + 40 * DAY_MS); // rabat 10%

const dbEvent = {
	_id: { toString: () => EVENT_ID },
	name: 'Koncert',
	date: EVENT_DATE,
	prices: { normal: 100, VIP: 300, child: 50 },
	sectors: ['A'],
	seatRequired: true,
};

const product = (overrides: Record<string, unknown> = {}) => ({
	eventId: EVENT_ID,
	type: 'normal',
	sector: 'A',
	block: 'blue',
	seating: '1',
	...overrides,
});

const item = (overrides: Partial<CheckoutItem> = {}): CheckoutItem => ({
	eventId: EVENT_ID,
	type: 'normal',
	sector: 'A',
	block: 'blue',
	seating: '1',
	images: [],
	name: 'Koncert',
	date: EVENT_DATE,
	price: 90,
	...overrides,
});

const user = (overrides: Record<string, unknown> = {}) => ({
	_id: USER_ID,
	email: 'jan@example.com',
	appliedDiscountCodes: [] as { code: string; isUsed: boolean }[],
	myCart: [] as CheckoutItem[],
	save: vi.fn(),
	...overrides,
});

beforeEach(() => {
	vi.useFakeTimers({ toFake: ['Date'] });
	vi.setSystemTime(NOW);
	Ticket.exists.mockResolvedValue(null as never);
	Event.find.mockReturnValue(mockQuery([dbEvent]) as never);
});

afterEach(() => {
	vi.useRealTimers();
});

describe('calcTotalAmount', () => {
	it.each([
		[[0.1, 0.2], 0.3],
		[[33.33, 33.33, 33.34], 100],
		[[], 0],
	])('sums %j and rounds to grosze -> %s', (prices, expected) => {
		const result = calcTotalAmount(prices.map(price => item({ price })));

		expect(result).toBe(expected);
	});
});

describe('buildOrderTickets / buildTickets', () => {
	it('maps checkout items to order tickets with a seating array', () => {
		const result = buildOrderTickets([item(), item({ seating: '', type: 'VIP', price: 270 })]);
		const expected = [
			{ eventId: EVENT_ID, seating: [{ sector: 'A', block: 'blue', seat: 1 }], price: 90, type: 'normal' },
			{ eventId: EVENT_ID, seating: [{ sector: 'A', block: 'blue', seat: undefined }], price: 270, type: 'VIP' },
		];

		expect(result).toEqual(expected);
	});

	it('maps checkout items to ticket documents for the user', () => {
		const result = buildTickets([item()], USER_ID);
		const expected = [
			{ eventId: EVENT_ID, type: 'normal', price: 90, quantity: 1, seating: { sector: 'A', block: 'blue', seat: 1 }, userId: USER_ID, date: NOW },
		];

		expect(result).toEqual(expected);
	});

	it('adds extra fields such as orderId and status', () => {
		const [result] = buildTickets([item()], USER_ID, { orderId: 'order-1' as never, status: 'pending' });
		const expected = { orderId: 'order-1', status: 'pending' };

		expect(result).toMatchObject(expected);
	});
});

describe('prepareCheckout', () => {
	it('prices tickets on the server and ignores client prices', async () => {
		const result = await prepareCheckout(user() as never, { products: [product({ price: 1 })] });
		const expected = { items: [item()], discountCode: '' };

		expect(result).toEqual(expected);
	});

	it('loads each event only once for several tickets', async () => {
		await prepareCheckout(user() as never, { products: [product(), product({ seating: '2' })] });
		const expected = { _id: { $in: [EVENT_ID] } };

		expect(Event.find).toHaveBeenCalledWith(expected);
	});

	it('rejects the order with 409 when a seat is already taken', async () => {
		Ticket.exists.mockResolvedValue({ _id: 'ticket-1' } as never);

		const result = await catchAsyncError(prepareCheckout(user() as never, { products: [product({ seating: '7' })] }));
		const expected = { statusCode: 409, message: 'Miejsce 7 w sektorze A jest już zajęte' };
		const expectedSeatQuery = { eventId: EVENT_ID, 'seating.sector': 'A', 'seating.block': 'blue', 'seating.seat': 7 };

		expect(result).toMatchObject(expected);
		expect(Ticket.exists).toHaveBeenCalledWith(expectedSeatQuery);
	});

	it('does not check availability for tickets without a seat', async () => {
		Event.find.mockReturnValue(mockQuery([{ ...dbEvent, seatRequired: false }]) as never);

		await prepareCheckout(user() as never, { products: [product({ seating: '' })] });

		expect(Ticket.exists).not.toHaveBeenCalled();
	});

	it('rejects invalid products with 400 before querying the database', async () => {
		const result = await catchAsyncError(prepareCheckout(user() as never, { products: [] }));
		const expected = { statusCode: 400 };

		expect(result).toMatchObject(expected);
		expect(Event.find).not.toHaveBeenCalled();
	});

	it('applies a valid discount code to the subtotal', async () => {
		vi.mocked(getUsableDiscountCode).mockResolvedValue({ value: 0.5 } as never);
		const buyer = user();

		const result = await prepareCheckout(buyer as never, {
			products: [product(), product({ seating: '2', type: 'VIP' })],
			discountCode: '  PROMO50 ',
		});
		const expected = { items: [item({ price: 45 }), item({ seating: '2', type: 'VIP', price: 135 })], discountCode: 'PROMO50' };
		const expectedCodeCheck = ['PROMO50', 360, buyer];

		expect(result).toEqual(expected);
		expect(getUsableDiscountCode).toHaveBeenCalledWith(...expectedCodeCheck);
	});

	it.each([undefined, '', '   ', 123])('ignores a missing or non-string discount code (%s)', async discountCode => {
		const result = await prepareCheckout(user() as never, { products: [product()], discountCode });
		const expected = { items: [item()], discountCode: '' };

		expect(result).toEqual(expected);
		expect(getUsableDiscountCode).not.toHaveBeenCalled();
	});

	it('propagates errors from an unusable discount code', async () => {
		vi.mocked(getUsableDiscountCode).mockRejectedValue(Object.assign(new Error('Discount code has expired.'), { statusCode: 400 }));

		const result = await catchAsyncError(prepareCheckout(user() as never, { products: [product()], discountCode: 'OLD' }));
		const expected = { statusCode: 400, message: 'Discount code has expired.' };

		expect(result).toMatchObject(expected);
	});
});

describe('createCheckoutSession', () => {
	beforeEach(() => {
		createStripeSession.mockResolvedValue({ url: 'https://stripe.test/session' } as never);
	});

	it('returns the Stripe session URL', async () => {
		const result = await createCheckoutSession(user() as never, { products: [product()] });
		const expected = 'https://stripe.test/session';

		expect(result).toBe(expected);
	});

	it('stores the approved cart with server-side prices', async () => {
		await createCheckoutSession(user() as never, { products: [product()] });
		const expected = { myCart: [item()] };

		expect(User.findByIdAndUpdate).toHaveBeenCalledWith(USER_ID, expected);
	});

	it('creates the Stripe session with line items priced in grosze', async () => {
		await createCheckoutSession(user() as never, { products: [product()] });

		const result = sessionParams();
		const expected = {
			mode: 'payment',
			success_url: 'http://localhost:5173/success',
			cancel_url: 'http://localhost:5173/cancel',
			metadata: { userId: JSON.stringify(USER_ID), discountCode: 'null' },
			line_items: [
				{
					price_data: {
						currency: 'pln',
						product_data: {
							name: expect.stringMatching(/^Koncert - \d{2}\.\d{2}\.\d{4} \d{2}:\d{2}$/),
							images: undefined,
							description: 'sektor: A strefa: blue miejsce: 1',
						},
						unit_amount: 9000,
					},
					quantity: 1,
				},
			],
		};

		expect(result).toEqual(expected);
	});

	it('passes the discount code in the session metadata', async () => {
		vi.mocked(getUsableDiscountCode).mockResolvedValue({ value: 0.1 } as never);

		await createCheckoutSession(user() as never, { products: [product()], discountCode: 'PROMO' });
		const result = sessionParams().metadata;
		const expected = { userId: JSON.stringify(USER_ID), discountCode: '"PROMO"' };

		expect(result).toEqual(expected);
	});

	it('does not create a Stripe session when checkout validation fails', async () => {
		Ticket.exists.mockResolvedValue({ _id: 'taken' } as never);

		const result = await catchAsyncError(createCheckoutSession(user() as never, { products: [product()] }));
		const expected = { statusCode: 409 };

		expect(result).toMatchObject(expected);
		expect(createStripeSession).not.toHaveBeenCalled();
		expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
	});
});

describe('sendOrderConfirmation', () => {
	it('emails a PDF with the tickets', async () => {
		const pdf = Buffer.from('%PDF-');
		vi.mocked(generatePDF).mockResolvedValue(pdf);

		await sendOrderConfirmation('jan@example.com', 180, 'PLN', [{ name: 'Koncert' }]);
		const result = vi.mocked(sendEmail).mock.calls[0][0];
		const expected = {
			email: 'jan@example.com',
			subject: 'Złożenie zamówienia',
			html: expect.stringContaining('180 PLN'),
			attachments: [{ filename: 'bilety.pdf', content: pdf, contentType: 'application/pdf' }],
		};

		expect(result).toEqual(expected);
		expect(generatePDF).toHaveBeenCalledWith([{ name: 'Koncert' }]);
	});
});

describe('fulfillCheckoutSession', () => {
	const session = (discountCode: string | null = null) =>
		({ id: 'cs_1', metadata: { userId: JSON.stringify('user-1'), discountCode: JSON.stringify(discountCode) } }) as never;

	beforeEach(() => {
		vi.spyOn(console, 'warn').mockImplementation(() => {});
		vi.mocked(generatePDF).mockResolvedValue(Buffer.from('pdf'));
	});

	it('creates the order from the approved cart', async () => {
		const cart = [item(), item({ seating: '2', price: 270, type: 'VIP' })];
		User.findById.mockReturnValue(mockQuery(user({ myCart: cart })) as never);

		await fulfillCheckoutSession(session());
		const expected = { totalAmount: 360, date: NOW, userId: USER_ID, currency: 'PLN', tickets: buildOrderTickets(cart), countOfTickets: 2 };

		expect(Order.create).toHaveBeenCalledWith(expected);
	});

	it('reads the approved cart of the user from the session metadata', async () => {
		const query = mockQuery(user({ myCart: [item()] }));
		User.findById.mockReturnValue(query as never);

		await fulfillCheckoutSession(session());

		expect(User.findById).toHaveBeenCalledWith('user-1');
		expect(query.select).toHaveBeenCalledWith('+myCart');
	});

	it('creates tickets, emails them and clears both carts', async () => {
		const cart = [item()];
		User.findById.mockReturnValue(mockQuery(user({ myCart: cart })) as never);

		await fulfillCheckoutSession(session());
		const expectedTickets = buildTickets(cart, USER_ID);
		const expectedEmail = expect.objectContaining({ email: 'jan@example.com' });
		const expectedCartUpdate = { cart: [], myCart: [] };

		expect(Ticket.insertMany).toHaveBeenCalledWith(expectedTickets);
		expect(sendEmail).toHaveBeenCalledWith(expectedEmail);
		expect(User.findByIdAndUpdate).toHaveBeenCalledWith(USER_ID, expectedCartUpdate);
	});

	it('marks the used discount code', async () => {
		const buyer = user({ myCart: [item()], appliedDiscountCodes: [{ code: 'PROMO', isUsed: false }] });
		User.findById.mockReturnValue(mockQuery(buyer) as never);

		await fulfillCheckoutSession(session('PROMO'));
		const result = buyer.appliedDiscountCodes;
		const expected = [{ code: 'PROMO', isUsed: true }];

		expect(result).toEqual(expected);
		expect(buyer.save).toHaveBeenCalled();
	});

	it.each([
		['the user does not exist', null],
		['there is no approved cart (e.g. repeated webhook)', user({ myCart: [] })],
	])('does nothing when %s', async (_label, buyer) => {
		User.findById.mockReturnValue(mockQuery(buyer) as never);

		const result = await fulfillCheckoutSession(session());

		expect(result).toBeUndefined();
		expect(Order.create).not.toHaveBeenCalled();
		expect(Ticket.insertMany).not.toHaveBeenCalled();
	});

	it('throws 500 and keeps the cart when the confirmation email fails', async () => {
		User.findById.mockReturnValue(mockQuery(user({ myCart: [item()] })) as never);
		vi.mocked(sendEmail).mockRejectedValue(new Error('SMTP down'));

		const result = await catchAsyncError(fulfillCheckoutSession(session()));
		const expected = { statusCode: 500, message: 'Problem with sending an email.' };

		expect(result).toMatchObject(expected);
		expect(Order.create).toHaveBeenCalled();
		expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
	});
});
