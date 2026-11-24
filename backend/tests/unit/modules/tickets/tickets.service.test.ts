import { describe, expect, it, vi } from 'vitest';
import TicketModel from '../../../../modules/tickets/tickets.model.ts';
import EventModel from '../../../../modules/events/events.model.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { catchAsyncError } from '../../../helpers/catchError.ts';
import {
	findAllTickets,
	findOccupiedSeats,
	findTicketsOfUser,
	getFreeSectorsSummary,
} from '../../../../modules/tickets/tickets.service.ts';

vi.mock('../../../../modules/tickets/tickets.model.ts', () => ({ default: { find: vi.fn() } }));
vi.mock('../../../../modules/events/events.model.ts', () => ({ default: { findOne: vi.fn() } }));

const Ticket = vi.mocked(TicketModel);
const Event = vi.mocked(EventModel);

const CAPACITY_PER_SECTOR = 4 * 100;

describe('findAllTickets', () => {
	it('returns all tickets', async () => {
		Ticket.find.mockResolvedValue(['t1'] as never);

		const result = await findAllTickets();
		const expected = ['t1'];

		expect(result).toEqual(expected);
	});
});

describe('findTicketsOfUser', () => {
	it('returns the user tickets sorted by date with event data', async () => {
		const query = mockQuery(['t1']);
		Ticket.find.mockReturnValue(query as never);

		const result = await findTicketsOfUser('user-1');
		const expected = ['t1'];

		expect(result).toEqual(expected);
		expect(query.sort).toHaveBeenCalledWith({ date: 1 });
		expect(query.populate).toHaveBeenCalledWith('event');
	});

	it('hides tickets waiting for an offline payment', async () => {
		Ticket.find.mockReturnValue(mockQuery([]) as never);

		await findTicketsOfUser('user-1');
		const expected = { userId: 'user-1', status: { $ne: 'pending' } };

		expect(Ticket.find).toHaveBeenCalledWith(expected);
	});
});

describe('getFreeSectorsSummary', () => {
	it('subtracts sold and reserved tickets from each sector capacity', async () => {
		const tickets = [
			{ seating: { sector: 'A' } },
			{ seating: { sector: 'A' } },
			{ seating: { sector: 'B' } },
			{ seating: { sector: 'Z' } },
		];
		Ticket.find.mockReturnValue(mockQuery(tickets) as never);
		Event.findOne.mockReturnValue(mockQuery({ sectors: ['A', 'B', 'C'] }) as never);

		const result = await getFreeSectorsSummary('event-1');
		const expected = {
			ticketsCount: 4,
			freeSectorsCount: { A: CAPACITY_PER_SECTOR - 2, B: CAPACITY_PER_SECTOR - 1, C: CAPACITY_PER_SECTOR },
		};

		expect(result).toEqual(expected);
		expect(Ticket.find).toHaveBeenCalledWith({ eventId: 'event-1' });
		expect(Event.findOne).toHaveBeenCalledWith({ _id: 'event-1' });
	});

	it('returns full capacity when nothing is sold', async () => {
		Ticket.find.mockReturnValue(mockQuery([]) as never);
		Event.findOne.mockReturnValue(mockQuery({ sectors: ['A'] }) as never);

		const result = await getFreeSectorsSummary('event-1');
		const expected = { ticketsCount: 0, freeSectorsCount: { A: CAPACITY_PER_SECTOR } };

		expect(result).toEqual(expected);
	});

	it('throws 404 when the event does not exist', async () => {
		Ticket.find.mockReturnValue(mockQuery([]) as never);
		Event.findOne.mockReturnValue(mockQuery(null) as never);

		const result = await catchAsyncError(getFreeSectorsSummary('missing'));
		const expected = { statusCode: 404, message: 'No event found with that ID' };

		expect(result).toMatchObject(expected);
	});
});

describe('findOccupiedSeats', () => {
	it('returns sorted seat numbers', async () => {
		Ticket.find.mockReturnValue(
			mockQuery([{ seating: { seat: 12 } }, { seating: { seat: 3 } }, { seating: { seat: 100 } }]) as never,
		);

		const result = await findOccupiedSeats('event-1', 'A', 'blue');
		const expected = [3, 12, 100];

		expect(result).toEqual(expected);
	});

	it('looks only at seated tickets in the given sector block', async () => {
		Ticket.find.mockReturnValue(mockQuery([]) as never);

		await findOccupiedSeats('event-1', 'A', 'blue');
		const expected = {
			eventId: 'event-1',
			'seating.sector': 'A',
			'seating.block': 'blue',
			'seating.seat': { $ne: null },
		};

		expect(Ticket.find).toHaveBeenCalledWith(expected);
	});

	it('returns an empty list when no seats are taken', async () => {
		Ticket.find.mockReturnValue(mockQuery([]) as never);

		const result = await findOccupiedSeats('event-1', 'A', 'blue');
		const expected: number[] = [];

		expect(result).toEqual(expected);
	});
});
