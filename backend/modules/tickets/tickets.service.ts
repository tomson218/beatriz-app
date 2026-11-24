import TicketModel from './tickets.model.ts';
import EventModel from '../events/events.model.ts';
import { COUNT_BLOCKS, COUNT_SEAT } from '@beatriz/shared/constants/hallCapacity';
import type { FreeSectorsSummary, SectorCounts, TicketDocument } from './tickets.type.ts';

const CAPACITY_PER_SECTOR: number = COUNT_BLOCKS * COUNT_SEAT;

const countTicketsBySector = (tickets: TicketDocument[]): SectorCounts => {
	return tickets.reduce<SectorCounts>((counts, ticket) => {
		const sector = String(ticket.seating?.sector);
		counts[sector] = (counts[sector] ?? 0) + 1;

		return counts;
	}, {});
};

export const findAllTickets = async (): Promise<TicketDocument[]> => {
	return TicketModel.find();
};

/** Bilety czekające na wpłatę offline nie są jeszcze ważne, więc użytkownik ich nie widzi. */
export const findTicketsOfUser = async (userId: string): Promise<TicketDocument[]> => {
	return TicketModel.find({ userId, status: { $ne: 'pending' } })
		.sort({ date: 1 })
		.populate('event')
		.exec();
};

/** Liczy wolne miejsca w każdym sektorze wydarzenia (pojemność sektora minus sprzedane i zarezerwowane bilety). */
export const getFreeSectorsSummary = async (eventId: string): Promise<FreeSectorsSummary> => {
	const tickets: TicketDocument[] = await TicketModel.find({ eventId }).select('-__v').exec();
	const event = await EventModel.findOne({ _id: eventId }).select('sectors -_id').exec();

	if (!event) {
		throw Object.assign(new Error('No event found with that ID'), { statusCode: 404 });
	}

	const occupiedBySector: SectorCounts = countTicketsBySector(tickets);
	const freeEntries = event.sectors.map(sector => [
		sector,
		CAPACITY_PER_SECTOR - (occupiedBySector[String(sector)] ?? 0),
	]);

	return { ticketsCount: tickets.length, freeSectorsCount: Object.fromEntries(freeEntries) };
};

/** Zwraca posortowane numery zajętych miejsc w danej strefie sektora (także tych czekających na wpłatę offline). */
export const findOccupiedSeats = async (eventId: string, sector: string, block: string): Promise<number[]> => {
	const tickets: TicketDocument[] = await TicketModel.find({
		eventId,
		'seating.sector': sector,
		'seating.block': block,
		'seating.seat': { $ne: null },
	}).select('-__v');

	return tickets.map(ticket => Number(ticket.seating?.seat)).sort((a, b) => a - b);
};
