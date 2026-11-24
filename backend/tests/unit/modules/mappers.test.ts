import { describe, expect, it } from 'vitest';
import { toDiscountCodeDto } from '../../../modules/discountCodes/discountCodes.mapper.ts';
import { toEventDto } from '../../../modules/events/events.mapper.ts';
import { toOrderDto } from '../../../modules/orders/orders.mapper.ts';
import { toPostDto } from '../../../modules/posts/posts.mapper.ts';
import { toTicketDto } from '../../../modules/tickets/tickets.mapper.ts';
import { toUserDto } from '../../../modules/users/users.mapper.ts';

const objectId = (value: string) => ({ toString: () => value });

/** Imitates a Mongoose document: populated (virtual) fields are only available through `get()`. */
const doc = <T extends object>(fields: T, virtuals: Record<string, unknown> = {}) => ({
	...fields,
	get: (key: string) => virtuals[key],
});

describe('toUserDto', () => {
	it('exposes only public fields (never the password or tokens)', () => {
		const user = {
			_id: objectId('u1'),
			username: 'jan',
			email: 'jan@x.pl',
			firstName: 'Jan',
			lastName: 'K',
			photo: 'default.jpg',
			favouriteEventIds: [],
			cart: [],
			appliedDiscountCodes: [],
			role: 'user',
			password: 'hash',
			passwordConfirm: 'hash',
			googleId: 'g-1',
			myCart: [{ price: 1 }],
		};

		const result = toUserDto(user as never);
		const expected = {
			_id: 'u1',
			username: 'jan',
			email: 'jan@x.pl',
			firstName: 'Jan',
			lastName: 'K',
			photo: 'default.jpg',
			favouriteEventIds: [],
			cart: [],
			appliedDiscountCodes: [],
			role: 'user',
		};

		expect(result).toStrictEqual(expected);
	});
});

describe('toEventDto', () => {
	it('converts the id to a string, keeps the discount and drops internal fields', () => {
		const date = new Date('2026-06-01');
		const event = {
			_id: objectId('e1'),
			name: 'Koncert',
			description: 'Opis',
			star: ['Artysta'],
			date,
			image: 'e1.jpg',
			seatRequired: true,
			sectors: ['A'],
			prices: { normal: 90 },
			type: 'concert',
			discount: 0.1,
			__v: 0,
		};

		const result = toEventDto(event as never);
		const expected = {
			_id: 'e1',
			name: 'Koncert',
			description: 'Opis',
			star: ['Artysta'],
			date,
			image: 'e1.jpg',
			seatRequired: true,
			sectors: ['A'],
			prices: { normal: 90 },
			type: 'concert',
			discount: 0.1,
		};

		expect(result).toStrictEqual(expected);
	});
});

describe('toDiscountCodeDto', () => {
	it('maps the discount code fields', () => {
		const expiration = new Date('2026-06-01');
		const code = {
			_id: objectId('d1'),
			code: 'PROMO',
			value: 0.2,
			expiration,
			usageLimit: 5,
			usageConditions: 100,
			__v: 0,
		};

		const result = toDiscountCodeDto(code as never);
		const expected = { _id: 'd1', code: 'PROMO', value: 0.2, expiration, usageLimit: 5, usageConditions: 100 };

		expect(result).toStrictEqual(expected);
	});
});

describe('toOrderDto', () => {
	const ticket = {
		_id: 't1',
		eventId: 'e1',
		event: { name: 'Koncert' },
		seating: [],
		price: 90,
		type: 'normal',
		extra: 'x',
	};
	const orderDate = new Date('2026-11-19T10:00:00Z');

	const order = (status?: string) =>
		doc(
			{
				_id: objectId('o1'),
				totalAmount: 90,
				date: orderDate,
				userId: 'u1',
				currency: 'PLN',
				tickets: [ticket],
				countOfTickets: 1,
				paymentMethod: 'offline',
				status,
			},
			{ user: { username: 'jan' } },
		);

	it('maps a pending order and adds the payment deadline (48 h)', () => {
		const result = toOrderDto(order('pending') as never);
		const expected = {
			_id: 'o1',
			totalAmount: 90,
			date: orderDate,
			userId: 'u1',
			user: { username: 'jan' },
			currency: 'PLN',
			tickets: [{ _id: 't1', eventId: 'e1', event: { name: 'Koncert' }, seating: [], price: 90, type: 'normal' }],
			countOfTickets: 1,
			paymentMethod: 'offline',
			status: 'pending',
			expiresAt: new Date('2026-11-21T10:00:00Z'),
		};

		expect(result).toStrictEqual(expected);
	});

	it.each(['paid', 'rejected', 'expired', undefined])('has no deadline for %s orders', status => {
		const result = toOrderDto(order(status) as never).expiresAt;

		expect(result).toBeUndefined();
	});
});

describe('toPostDto', () => {
	it('includes populated user and event', () => {
		const date = new Date('2026-06-01');
		const post = doc(
			{ _id: objectId('p1'), date, userId: 'u1', eventId: 'e1', message: 'Hej' },
			{ user: { username: 'jan' }, event: { name: 'Koncert' } },
		);

		const result = toPostDto(post as never);
		const expected = {
			_id: 'p1',
			date,
			userId: 'u1',
			user: { username: 'jan' },
			eventId: 'e1',
			event: { name: 'Koncert' },
			message: 'Hej',
		};

		expect(result).toStrictEqual(expected);
	});
});

describe('toTicketDto', () => {
	it('includes populated event and user', () => {
		const date = new Date('2026-06-01');
		const ticket = doc(
			{
				_id: objectId('t1'),
				eventId: 'e1',
				seating: { sector: 'A' },
				userId: 'u1',
				quantity: 1,
				price: 90,
				type: 'normal',
				date,
				status: 'active',
			},
			{ event: { name: 'Koncert' }, user: { username: 'jan' } },
		);

		const result = toTicketDto(ticket as never);
		const expected = {
			_id: 't1',
			eventId: 'e1',
			event: { name: 'Koncert' },
			seating: { sector: 'A' },
			userId: 'u1',
			user: { username: 'jan' },
			quantity: 1,
			price: 90,
			type: 'normal',
			date,
			status: 'active',
		};

		expect(result).toStrictEqual(expected);
	});
});
