import type { NextFunction, Request, Response } from 'express';
import { toTicketDto } from './tickets.mapper.ts';
import { findAllTickets, findOccupiedSeats, findTicketsOfUser, getFreeSectorsSummary } from './tickets.service.ts';
import type { TicketDto } from '@beatriz/shared/tickets';
import type { EventTicketsParams, FreeSectorsSummary, TicketDocument, UserTicketsParams } from './tickets.type.ts';

export const getAllTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const tickets: TicketDocument[] = await findAllTickets();
		const ticketsDto: TicketDto[] = tickets.map(toTicketDto);

		res.status(200).json({
			status: 'success',
			data: { results: ticketsDto.length, tickets: ticketsDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getUserTickets = async (req: Request<UserTicketsParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const tickets: TicketDocument[] = await findTicketsOfUser(req.params.id);
		const ticketsDto: TicketDto[] = tickets.map(toTicketDto);

		res.status(200).json({
			status: 'success',
			data: { results: ticketsDto.length, tickets: ticketsDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getMyTickets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const tickets: TicketDocument[] = await findTicketsOfUser(String(req.user._id));
		const ticketsDto: TicketDto[] = tickets.map(toTicketDto);

		res.status(200).json({
			status: 'success',
			data: { results: ticketsDto.length, tickets: ticketsDto },
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
		const { ticketsCount, freeSectorsCount }: FreeSectorsSummary = await getFreeSectorsSummary(req.params.eventId);

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
		const sector: string = String(req.query.sector ?? '');
		const block: string = String(req.query.block ?? '');
		const occupiedSeats: number[] = await findOccupiedSeats(req.params.eventId, sector, block);

		res.status(200).json({
			status: 'success',
			data: { results: occupiedSeats.length, occupiedSeats },
		});
	} catch (error) {
		next(error);
	}
};
