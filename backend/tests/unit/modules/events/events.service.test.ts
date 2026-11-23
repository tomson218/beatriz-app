import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import EventModel from '../../../../modules/events/events.model.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { catchAsyncError } from '../../../helpers/catchError.ts';
import { createEvent, deleteEventById, findEventById, findUpcomingEvents, updateEventDescription } from '../../../../modules/events/events.service.ts';

vi.mock('../../../../modules/events/events.model.ts', () => ({
	default: { find: vi.fn(), findById: vi.fn(), create: vi.fn(), findByIdAndUpdate: vi.fn(), findByIdAndDelete: vi.fn() },
}));

const Event = vi.mocked(EventModel);

const NOW = new Date('2026-01-01T12:00:00Z');
const DAY_MS = 24 * 60 * 60 * 1000;

const fakeEvent = (daysAhead: number) => ({
	_id: 'event-1',
	name: 'Koncert',
	date: new Date(NOW.getTime() + daysAhead * DAY_MS),
	prices: { normal: 100, VIP: 300, child: 50 },
});

const notFound = { statusCode: 404, message: 'No event found with that ID' };

beforeEach(() => {
	vi.useFakeTimers();
	vi.setSystemTime(NOW);
});

afterEach(() => {
	vi.useRealTimers();
});

describe('findUpcomingEvents', () => {
	it('returns events with prices after the time-based discount or surcharge', async () => {
		Event.find.mockReturnValue(mockQuery([fakeEvent(100), fakeEvent(15)]) as never);

		const result = await findUpcomingEvents();
		const expected = [
			{ ...fakeEvent(100), discount: 0.25, prices: { normal: 75, VIP: 225, child: 38 } },
			{ ...fakeEvent(15), discount: 1.2, prices: { normal: 120, VIP: 360, child: 60 } },
		];

		expect(result).toEqual(expected);
	});

	it('queries only future events sorted by date', async () => {
		const query = mockQuery([]);
		Event.find.mockReturnValue(query as never);

		await findUpcomingEvents();
		const expectedFilter = { date: { $gte: NOW } };
		const expectedSort = { date: 1 };

		expect(Event.find).toHaveBeenCalledWith(expectedFilter);
		expect(query.sort).toHaveBeenCalledWith(expectedSort);
		expect(query.lean).toHaveBeenCalled();
	});
});

describe('findEventById', () => {
	it('returns the event with discounted prices', async () => {
		Event.findById.mockReturnValue(mockQuery(fakeEvent(40)) as never);

		const result = await findEventById('event-1');
		const expected = { ...fakeEvent(40), discount: 0.1, prices: { normal: 90, VIP: 270, child: 45 } };

		expect(result).toEqual(expected);
		expect(Event.findById).toHaveBeenCalledWith('event-1');
	});

	it('throws 404 when the event does not exist', async () => {
		Event.findById.mockReturnValue(mockQuery(null) as never);

		const result = await catchAsyncError(findEventById('missing'));
		const expected = notFound;

		expect(result).toMatchObject(expected);
	});
});

describe('createEvent', () => {
	const input = {
		name: 'Koncert',
		date: '2026-06-01T20:00:00Z',
		description: 'Opis',
		type: 'concert',
		seatRequired: true,
		star: 'Artysta 1, Artysta 2 ',
		sectors: 'A, B,C',
		child: '50',
		normal: '100',
		vip: '300',
	} as const;

	it('returns the created event', async () => {
		Event.create.mockResolvedValue('created' as never);

		const result = await createEvent(input as never, 'event-1.jpg');
		const expected = 'created';

		expect(result).toBe(expected);
	});

	it('parses prices and comma-separated lists from the form data', async () => {
		await createEvent(input as never, 'event-1.jpg');
		const expected = {
			name: 'Koncert',
			date: '2026-06-01T20:00:00Z',
			description: 'Opis',
			type: 'concert',
			seatRequired: true,
			image: 'event-1.jpg',
			prices: { child: 50, normal: 100, VIP: 300 },
			sectors: ['A', 'B', 'C'],
			star: ['Artysta 1', 'Artysta 2'],
		};

		expect(Event.create).toHaveBeenCalledWith(expected);
	});

	it.each([
		['child', '0', 'Cena biletu dziecięcego'],
		['normal', '-10', 'Cena biletu normalnego'],
		['vip', 'abc', 'Cena biletu VIP'],
	])('rejects an invalid %s price (%s)', async (field, value, label) => {
		const result = await catchAsyncError(createEvent({ ...input, [field]: value } as never));
		const expected = { statusCode: 400, message: `${label} musi być liczbą dodatnią` };

		expect(result).toMatchObject(expected);
		expect(Event.create).not.toHaveBeenCalled();
	});
});

describe('updateEventDescription', () => {
	it('updates only the description and returns the new event', async () => {
		Event.findByIdAndUpdate.mockResolvedValue({ description: 'Nowy' } as never);

		const result = await updateEventDescription('event-1', 'Nowy');
		const expected = { description: 'Nowy' };

		expect(result).toEqual(expected);
		expect(Event.findByIdAndUpdate).toHaveBeenCalledWith('event-1', { description: 'Nowy' }, { new: true });
	});

	it('throws 404 when the event does not exist', async () => {
		Event.findByIdAndUpdate.mockResolvedValue(null);

		const result = await catchAsyncError(updateEventDescription('missing', 'x'));
		const expected = notFound;

		expect(result).toMatchObject(expected);
	});
});

describe('deleteEventById', () => {
	it('deletes the event', async () => {
		Event.findByIdAndDelete.mockResolvedValue({ _id: 'event-1' } as never);

		const result = await deleteEventById('event-1');

		expect(result).toBeUndefined();
		expect(Event.findByIdAndDelete).toHaveBeenCalledWith('event-1');
	});

	it('throws 404 when the event does not exist', async () => {
		Event.findByIdAndDelete.mockResolvedValue(null);

		const result = await catchAsyncError(deleteEventById('missing'));
		const expected = notFound;

		expect(result).toMatchObject(expected);
	});
});
