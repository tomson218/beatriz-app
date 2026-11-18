import type { NextFunction, Request, Response } from 'express';
import { toTicketDto } from './tickets.mapper.ts';
import {
	getAllTickets as findAllTickets,
	getFreeSectorsSummary,
	getOccupiedSeats as findOccupiedSeats,
	getTicketsOfUser,
} from './tickets.service.ts';
import type { EventTicketsParams, UserTicketsParams } from './tickets.type.ts';

export const getAllTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const tickets = await findAllTickets();

		res.status(200).json({
			status: 'success',
			data: { results: tickets.length, tickets: tickets.map(toTicketDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const getUserTickets = async (req: Request<UserTicketsParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const tickets = await getTicketsOfUser(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { results: tickets.length, tickets: tickets.map(toTicketDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const groupAvailableSectors = async (
	req: Request<EventTicketsParams>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { ticketsCount, freeSectorsCount } = await getFreeSectorsSummary(req.params.eventId);

		res.status(200).json({
			status: 'success',
			data: { results: ticketsCount, freeSectorsCount },
		});
	} catch (error) {
		next(error);
	}
};

export const getOccupiedSeats = async (req: Request<EventTicketsParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const sector = String(req.query.sector ?? '');
		const block = String(req.query.block ?? '');
		const occupiedSeats = await findOccupiedSeats(req.params.eventId, sector, block);

		res.status(200).json({
			status: 'success',
			data: { results: occupiedSeats.length, occupiedSeats },
		});
	} catch (error) {
		next(error);
	}
};
