import { catchAsync } from '../utils/catchAsync.ts';
import { listResponse } from '../utils/apiResponse.ts';
import { toTicketDto } from '../mappers/ticketMapper.ts';
import {
	getAllTickets as findAllTickets,
	getFreeSectorsSummary,
	getOccupiedSeats as findOccupiedSeats,
	getTicketsOfUser,
} from '../services/ticketService.ts';

/** Parametry trasy z miejscami: identyfikator wydarzenia, sektor i strefa. */
interface OccupiedSeatsRouteParams {
	eventId: string;
	sector: string;
	block: string;
}

export const getAllTickets = catchAsync(async (req, res) => {
	const tickets = await findAllTickets();

	res.status(200).json(listResponse('tickets', tickets.map(toTicketDto)));
});

export const getUserTickets = catchAsync<{ id: string }>(async (req, res) => {
	const tickets = await getTicketsOfUser(req.params.id);

	res.status(200).json(listResponse('tickets', tickets.map(toTicketDto)));
});

export const groupAvailableSectors = catchAsync<{ eventId: string }>(async (req, res) => {
	const { ticketsCount, freeSectorsCount } = await getFreeSectorsSummary(req.params.eventId);

	res.status(200).json({ status: 'success', data: { results: ticketsCount, freeSectorsCount } });
});

export const getOccupiedSeats = catchAsync<OccupiedSeatsRouteParams>(async (req, res) => {
	const { eventId, sector, block } = req.params;
	const occupiedSeats = await findOccupiedSeats(eventId, sector, block);

	res.status(200).json({ status: 'success', data: { results: occupiedSeats.length, occupiedSeats } });
});
