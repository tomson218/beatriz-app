import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import OrderModel from '../../../../modules/orders/orders.model.ts';
import TicketModel from '../../../../modules/tickets/tickets.model.ts';
import UserModel from '../../../../modules/users/users.model.ts';
import {
	buildOrderTickets,
	buildTickets,
	calcTotalAmount,
	prepareCheckout,
	sendOrderConfirmation,
} from '../../../../modules/payments/payments.service.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { catchAsyncError, catchError } from '../../../helpers/catchError.ts';
import {
	createOfflineOrder,
	expireOverdueOfflineOrders,
	findAllOrders,
	findOrdersOfUser,
	parseOrderDecision,
	parseOrderStatus,
	resolveOfflineOrder,
} from '../../../../modules/orders/orders.service.ts';

vi.mock('../../../../modules/orders/orders.model.ts', () => ({
	default: { find: vi.fn(), create: vi.fn(), findOneAndUpdate: vi.fn(), exists: vi.fn() },
}));
vi.mock('../../../../modules/tickets/tickets.model.ts', () => ({
	default: { insertMany: vi.fn(), deleteMany: vi.fn(), updateMany: vi.fn() },
}));
vi.mock('../../../../modules/users/users.model.ts', () => ({ default: { findById: vi.fn() } }));
vi.mock('../../../../modules/payments/payments.service.ts', () => ({
	prepareCheckout: vi.fn(),
	calcTotalAmount: vi.fn(),
	buildOrderTickets: vi.fn(),
	buildTickets: vi.fn(),
	sendOrderConfirmation: vi.fn(),
}));

const Order = vi.mocked(OrderModel);
const Ticket = vi.mocked(TicketModel);
const User = vi.mocked(UserModel);

const NOW = new Date('2026-01-03T12:00:00Z');
const OVERDUE_DATE = new Date('2026-01-01T12:00:00Z');

beforeEach(() => {
	vi.useFakeTimers({ toFake: ['Date'] });
	vi.setSystemTime(NOW);
});

afterEach(() => {
	vi.useRealTimers();
});

describe('parseOrderStatus', () => {
	it('returns undefined when no status is given', () => {
		const result = parseOrderStatus(undefined);

		expect(result).toBeUndefined();
	});

	it.each(['pending', 'paid', 'rejected', 'expired'])('accepts %s', status => {
		const result = parseOrderStatus(status);
		const expected = status;

		expect(result).toBe(expected);
	});

	it.each(['PAID', '', 'cancelled', null, 1])('rejects %s with 400', status => {
		const result = catchError(() => parseOrderStatus(status));
		const expected = { statusCode: 400, message: `Invalid order status: ${String(status)}` };

		expect(result).toMatchObject(expected);
	});
});

describe('parseOrderDecision', () => {
	it.each(['paid', 'rejected'])('accepts %s', decision => {
		const result = parseOrderDecision(decision);
		const expected = decision;

		expect(result).toBe(expected);
	});

	it.each(['pending', 'expired', undefined, 'PAID'])('rejects %s with 400', decision => {
		const result = catchError(() => parseOrderDecision(decision));
		const expected = { statusCode: 400, message: 'Order status must be "paid" or "rejected".' };

		expect(result).toMatchObject(expected);
	});
});

describe('findAllOrders', () => {
	it.each([
		[undefined, {}],
		['pending', { status: 'pending' }],
		['rejected', { status: 'rejected' }],
		['paid', { status: { $in: ['paid', null] } }],
	] as const)('filters by status %s', async (status, expected) => {
		Order.find.mockReturnValue(mockQuery([]) as never);

		await findAllOrders(status);

		expect(Order.find).toHaveBeenCalledWith(expected);
	});

	it('returns the newest orders first with user and event data', async () => {
		const query = mockQuery(['order']);
		Order.find.mockReturnValue(query as never);

		const result = await findAllOrders();
		const expected = ['order'];

		expect(result).toEqual(expected);
		expect(query.populate).toHaveBeenCalledWith('user', 'username email');
		expect(query.populate).toHaveBeenCalledWith('tickets.event', 'name date');
		expect(query.sort).toHaveBeenCalledWith({ date: -1 });
	});
});

describe('findOrdersOfUser', () => {
	it('returns the newest orders of the user first', async () => {
		const query = mockQuery(['order']);
		Order.find.mockReturnValue(query as never);

		const result = await findOrdersOfUser('user-1');
		const expected = ['order'];

		expect(result).toEqual(expected);
		expect(Order.find).toHaveBeenCalledWith({ userId: 'user-1' });
		expect(query.sort).toHaveBeenCalledWith({ date: -1 });
	});
});

describe('createOfflineOrder', () => {
	const items = [{ price: 90 }];

	beforeEach(() => {
		vi.mocked(prepareCheckout).mockResolvedValue({ items, discountCode: 'PROMO' } as never);
		vi.mocked(calcTotalAmount).mockReturnValue(90);
		vi.mocked(buildOrderTickets).mockReturnValue(['orderTicket'] as never);
		vi.mocked(buildTickets).mockReturnValue(['ticket'] as never);
		Order.create.mockResolvedValue({ _id: 'order-1' } as never);
	});

	it('returns the created order', async () => {
		const result = await createOfflineOrder({ _id: 'user-1' } as never, { products: [] });
		const expected = { _id: 'order-1' };

		expect(result).toEqual(expected);
	});

	it('creates a pending offline order', async () => {
		await createOfflineOrder({ _id: 'user-1' } as never, { products: [] });
		const expected = {
			totalAmount: 90,
			date: NOW,
			userId: 'user-1',
			currency: 'PLN',
			tickets: ['orderTicket'],
			countOfTickets: 1,
			paymentMethod: 'offline',
			status: 'pending',
			discountCode: 'PROMO',
		};

		expect(Order.create).toHaveBeenCalledWith(expected);
	});

	it('reserves seats with pending tickets linked to the order', async () => {
		await createOfflineOrder({ _id: 'user-1' } as never, { products: [] });
		const expectedTicketArgs = [items, 'user-1', { orderId: 'order-1', status: 'pending' }];
		const expectedTickets = ['ticket'];

		expect(buildTickets).toHaveBeenCalledWith(...expectedTicketArgs);
		expect(Ticket.insertMany).toHaveBeenCalledWith(expectedTickets);
	});

	it('stores no discount code when none was used', async () => {
		vi.mocked(prepareCheckout).mockResolvedValue({ items: [], discountCode: '' } as never);

		await createOfflineOrder({ _id: 'user-1' } as never, { products: [] });
		const expected = expect.objectContaining({ discountCode: undefined });

		expect(Order.create).toHaveBeenCalledWith(expected);
	});

	it('does not create an order when checkout validation fails', async () => {
		vi.mocked(prepareCheckout).mockRejectedValue(Object.assign(new Error('taken'), { statusCode: 409 }));

		const result = await catchAsyncError(createOfflineOrder({ _id: 'user-1' } as never, { products: [] }));
		const expected = { statusCode: 409, message: 'taken' };

		expect(result).toMatchObject(expected);
		expect(Order.create).not.toHaveBeenCalled();
	});
});

describe('expireOverdueOfflineOrders', () => {
	it('returns how many orders were expired (skipping ones resolved in the meantime)', async () => {
		Order.find.mockReturnValue(mockQuery([{ _id: 'o1' }, { _id: 'o2' }]) as never);
		Order.findOneAndUpdate.mockResolvedValueOnce({ _id: 'o1' } as never).mockResolvedValueOnce(null as never);

		const result = await expireOverdueOfflineOrders();
		const expected = 1;

		expect(result).toBe(expected);
	});

	it('looks for pending offline orders older than 48 hours', async () => {
		Order.find.mockReturnValue(mockQuery([]) as never);

		await expireOverdueOfflineOrders();
		const expected = { paymentMethod: 'offline', status: 'pending', date: { $lte: OVERDUE_DATE } };

		expect(Order.find).toHaveBeenCalledWith(expected);
	});

	it('expires only still-pending orders and frees their seats', async () => {
		Order.find.mockReturnValue(mockQuery([{ _id: 'o1' }, { _id: 'o2' }]) as never);
		Order.findOneAndUpdate.mockResolvedValueOnce({ _id: 'o1' } as never).mockResolvedValueOnce(null as never);

		await expireOverdueOfflineOrders();
		const result = Ticket.deleteMany.mock.calls;
		const expected = [[{ orderId: 'o1' }]];

		expect(result).toEqual(expected);
		expect(Order.findOneAndUpdate).toHaveBeenCalledWith({ _id: 'o1', status: 'pending' }, { status: 'expired' });
	});

	it('returns 0 when there are no overdue orders', async () => {
		Order.find.mockReturnValue(mockQuery([]) as never);

		const result = await expireOverdueOfflineOrders();
		const expected = 0;

		expect(result).toBe(expected);
		expect(Ticket.deleteMany).not.toHaveBeenCalled();
	});
});

describe('resolveOfflineOrder', () => {
	const order = () => ({
		_id: 'order-1',
		userId: 'user-1',
		totalAmount: 90,
		currency: 'PLN',
		discountCode: 'PROMO',
		tickets: [
			{
				event: { name: 'Koncert', date: new Date('2026-02-01') },
				seating: [{ sector: 'A', block: 'blue', seat: 3 }],
				price: 90,
				type: 'normal',
			},
		],
	});

	const buyer = () => ({
		email: 'jan@example.com',
		cart: ['something'],
		appliedDiscountCodes: [{ code: 'PROMO', isUsed: false }],
		save: vi.fn(),
	});

	beforeEach(() => {
		vi.mocked(sendOrderConfirmation).mockResolvedValue();
	});

	it('returns the approved order', async () => {
		const resolved = order();
		Order.findOneAndUpdate.mockReturnValue(mockQuery(resolved) as never);
		User.findById.mockResolvedValue(buyer() as never);

		const result = await resolveOfflineOrder('order-1', 'paid');
		const expected = resolved;

		expect(result).toBe(expected);
	});

	it('updates only pending, not overdue offline orders', async () => {
		Order.findOneAndUpdate.mockReturnValue(mockQuery(order()) as never);
		User.findById.mockResolvedValue(buyer() as never);

		await resolveOfflineOrder('order-1', 'paid');
		const expectedFilter = {
			_id: 'order-1',
			paymentMethod: 'offline',
			status: 'pending',
			date: { $gt: OVERDUE_DATE },
		};

		expect(Order.findOneAndUpdate).toHaveBeenCalledWith(expectedFilter, { status: 'paid' }, { new: true });
	});

	it('on approval activates tickets, marks the code as used and clears the cart', async () => {
		const user = buyer();
		Order.findOneAndUpdate.mockReturnValue(mockQuery(order()) as never);
		User.findById.mockResolvedValue(user as never);

		await resolveOfflineOrder('order-1', 'paid');
		const result = { appliedDiscountCodes: user.appliedDiscountCodes, cart: user.cart };
		const expected = { appliedDiscountCodes: [{ code: 'PROMO', isUsed: true }], cart: [] };

		expect(result).toEqual(expected);
		expect(Ticket.updateMany).toHaveBeenCalledWith({ orderId: 'order-1' }, { status: 'active' });
		expect(user.save).toHaveBeenCalledWith({ validateBeforeSave: false });
	});

	it('on approval emails the tickets', async () => {
		Order.findOneAndUpdate.mockReturnValue(mockQuery(order()) as never);
		User.findById.mockResolvedValue(buyer() as never);

		await resolveOfflineOrder('order-1', 'paid');
		const result = vi.mocked(sendOrderConfirmation).mock.calls[0];
		const expected = [
			'jan@example.com',
			90,
			'PLN',
			[
				{
					name: 'Koncert',
					date: new Date('2026-02-01'),
					sector: 'A',
					block: 'blue',
					seating: 3,
					price: 90,
					type: 'normal',
				},
			],
		];

		expect(result).toEqual(expected);
	});

	it('keeps the approval when the confirmation email fails', async () => {
		vi.spyOn(console, 'error').mockImplementation(() => {});
		const resolved = order();
		Order.findOneAndUpdate.mockReturnValue(mockQuery(resolved) as never);
		User.findById.mockResolvedValue(buyer() as never);
		vi.mocked(sendOrderConfirmation).mockRejectedValue(new Error('SMTP down'));

		const result = await resolveOfflineOrder('order-1', 'paid');
		const expected = resolved;

		expect(result).toBe(expected);
		expect(console.error).toHaveBeenCalled();
	});

	it('approves the order even if the user was deleted', async () => {
		const resolved = order();
		Order.findOneAndUpdate.mockReturnValue(mockQuery(resolved) as never);
		User.findById.mockResolvedValue(null);

		const result = await resolveOfflineOrder('order-1', 'paid');
		const expected = resolved;

		expect(result).toBe(expected);
		expect(sendOrderConfirmation).not.toHaveBeenCalled();
	});

	it('rejects a pending order and frees its seats', async () => {
		Order.findOneAndUpdate.mockReturnValue(mockQuery(order()) as never);

		await resolveOfflineOrder('order-1', 'rejected');
		const expected = { orderId: 'order-1' };

		expect(Ticket.deleteMany).toHaveBeenCalledWith(expected);
		expect(Ticket.updateMany).not.toHaveBeenCalled();
		expect(User.findById).not.toHaveBeenCalled();
	});

	it.each([
		[
			'exists but is not waiting for an offline payment',
			{ _id: 'order-1' },
			{ statusCode: 409, message: 'This order is not waiting for an offline payment.' },
		],
		['does not exist', null, { statusCode: 404, message: 'No order found with that ID' }],
	])('throws when the order %s', async (_label, existing, expected) => {
		Order.findOneAndUpdate.mockReturnValue(mockQuery(null) as never);
		Order.exists.mockResolvedValue(existing as never);

		const result = await catchAsyncError(resolveOfflineOrder('order-1', 'paid'));

		expect(result).toMatchObject(expected);
		expect(Ticket.updateMany).not.toHaveBeenCalled();
		expect(Ticket.deleteMany).not.toHaveBeenCalled();
	});
});
