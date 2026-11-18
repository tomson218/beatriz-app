import TicketModel from './tickets.model.ts';
import EventModel from '../events/events.model.ts';
import { COUNT_BLOCKS, COUNT_SEAT } from '@beatriz/shared/constants/hallCapacity';
import type { FreeSectorsSummary, SectorCounts, Ticket } from './tickets.type.ts';

const CAPACITY_PER_SECTOR = COUNT_BLOCKS * COUNT_SEAT;

const countTicketsBySector = (tickets: Ticket[]): SectorCounts => {
	return tickets.reduce<SectorCounts>((counts, ticket) => {
		const sector = ticket.seating.sector;
		counts[sector] = (counts[sector] ?? 0) + 1;

		return counts;
	}, {});
};

export const getAllTickets = async (): Promise<Ticket[]> => {
	return TicketModel.find();
};

export const getTicketsOfUser = async (userId: string): Promise<Ticket[]> => {
	return TicketModel.find({ userId }).sort({ date: 1 }).populate('event').exec();
};

/** Liczy wolne miejsca w każdym sektorze wydarzenia (pojemność sektora minus sprzedane bilety). */
export const getFreeSectorsSummary = async (eventId: string): Promise<FreeSectorsSummary> => {
	const tickets: Ticket[] = await TicketModel.find({ eventId }).select('-__v').exec();
	const event = await EventModel.findOne({ _id: eventId }).select('sectors -_id').exec();

	if (!event) {
		throw Object.assign(new Error('No event found with that ID'), { statusCode: 404 });
	}

	const occupiedBySector = countTicketsBySector(tickets);
	const freeEntries = event.sectors.map(sector => [sector, CAPACITY_PER_SECTOR - (occupiedBySector[sector] ?? 0)]);

	return { ticketsCount: tickets.length, freeSectorsCount: Object.fromEntries(freeEntries) };
};

/** Zwraca posortowane numery zajętych miejsc w danej strefie sektora. */
export const getOccupiedSeats = async (eventId: string, sector: string, block: string): Promise<number[]> => {
	const tickets: Ticket[] = await TicketModel.find({
		eventId,
		'seating.sector': sector,
		'seating.block': block,
	}).select('-__v');

	return tickets.map(ticket => Number(ticket.seating.seat)).sort((a, b) => a - b);
};
