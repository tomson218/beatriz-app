import TicketModel from '../models/ticketModel.ts';
import EventModel from '../models/eventModel.ts';
import AppError from '../utils/appError.ts';
import { COUNT_BLOCKS, COUNT_SEAT } from '@beatriz/shared/constants/hallCapacity';
import type { Ticket } from '@beatriz/shared/tickets';

/** Liczba biletów lub wolnych miejsc w podziale na sektory (klucz: oznaczenie sektora). */
type SectorCounts = Record<string, number>;

interface FreeSectorsSummary {
	ticketsCount: number;
	freeSectorsCount: SectorCounts;
}

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
	return TicketModel.find({ user: userId }).sort({ date: 1 }).populate('event').exec();
};

/** Liczy wolne miejsca w każdym sektorze wydarzenia (pojemność sektora minus sprzedane bilety). */
export const getFreeSectorsSummary = async (eventId: string): Promise<FreeSectorsSummary> => {
	const tickets: Ticket[] = await TicketModel.find({ event: eventId }).select('-__v').exec();
	const event = await EventModel.findOne({ _id: eventId }).select('sectors -_id').exec();

	if (!event) {
		throw new AppError('No event found with that ID', 404);
	}

	const occupiedBySector = countTicketsBySector(tickets);
	const freeEntries = event.sectors.map(sector => [sector, CAPACITY_PER_SECTOR - (occupiedBySector[sector] ?? 0)]);

	return { ticketsCount: tickets.length, freeSectorsCount: Object.fromEntries(freeEntries) };
};

/** Zwraca posortowane numery zajętych miejsc w danej strefie sektora. */
export const getOccupiedSeats = async (eventId: string, sector: string, block: string): Promise<number[]> => {
	const tickets: Ticket[] = await TicketModel.find({
		event: eventId,
		'seating.sector': sector,
		'seating.block': block,
	}).select('-__v');

	return tickets.map(ticket => Number(ticket.seating.seat)).sort((a, b) => a - b);
};
