import { isFailedResponse, isSuccessResponse } from '@/shared/utils/response';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import { cn } from '@/shared/lib/utils';
import { queryKeys } from '@/shared/api/queryKeys';
import { ORDER_STATUS_LABELS } from '@/features/orders/utils/orderStatus';

describe('isSuccessResponse / isFailedResponse', () => {
	it.each([
		['success', [true, false]],
		['fail', [false, true]],
		['error', [false, true]],
	] as const)('status %s -> %j', (status, expected) => {
		const result = [isSuccessResponse({ status }), isFailedResponse({ status })];

		expect(result).toEqual(expected);
	});
});

describe('formattedDate / formattedTime', () => {
	const date = new Date(2026, 10, 19, 9, 5);

	it('formats the date and time in Polish format', () => {
		const result = [formattedDate(date), formattedTime(date)];
		const expected = ['19.11.2026', '09:05'];

		expect(result).toEqual(expected);
	});
});

describe('cn', () => {
	it('joins class names, skips falsy values and lets later Tailwind classes win', () => {
		const isActive = false;

		const result = cn('px-2 py-1', isActive && 'bg-red-500', undefined, 'px-4');
		const expected = 'py-1 px-4';

		expect(result).toBe(expected);
	});
});

describe('queryKeys', () => {
	/** The `shared` types describe `_id` as an ObjectId, while the frontend receives it from the API as a string. */
	type Id = Parameters<typeof queryKeys.events.detail>[0];
	const id = (value: string): Id => value as unknown as Id;

	it('builds hierarchical keys so a whole group can be invalidated at once', () => {
		const result = {
			eventDetail: queryKeys.events.detail(id('event-1')),
			ordersByUser: queryKeys.orders.byUser(id('user-1')),
			pendingOrders: queryKeys.orders.pending(),
			occupiedSeats: queryKeys.occupiedSeats.bySector(id('event-1'), 'A', 'blue'),
		};
		const expected = {
			eventDetail: ['events', 'detail', 'event-1'],
			ordersByUser: ['orders', 'user-1'],
			pendingOrders: ['orders', 'pending'],
			occupiedSeats: ['occupied-seats', 'event-1', 'A', 'blue'],
		};

		expect(result).toEqual(expected);
	});
});

describe('ORDER_STATUS_LABELS', () => {
	it('has a label for every order status', () => {
		const result = Object.keys(ORDER_STATUS_LABELS).sort();
		const expected = ['expired', 'paid', 'pending', 'rejected'];

		expect(result).toEqual(expected);
	});
});
