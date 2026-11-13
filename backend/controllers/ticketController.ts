import TicketModel from '../models/ticketModel.ts';
import EventModel from '../models/eventModel.ts';
import { COUNT_BLOCKS, COUNT_SEAT } from '../capacityHall.ts';
import { type Request, type Response, type NextFunction } from 'express';
import type { GetAllTicketsResponse, GetUserTicketsResponse, TicketDto } from '../types/tickets.ts';
import { toTicketDto } from '../mappers/ticketMapper.ts';
import type { Ticket } from '../models/ticketModel.ts';
import type { User } from '../models/userModel.ts';

export const getAllTickets = async (
	req: Request,
	res: Response<GetAllTicketsResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const tickets: Ticket[] = await TicketModel.find();

		const ticketsDto: TicketDto[] = tickets.map((t: Ticket) => toTicketDto(t));

		res.status(200).json({
			status: 'success',
			data: {
				results: ticketsDto.length,
				tickets: ticketsDto,
			},
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Internal Server Error',
		});
	}
};

export const getUserTickets = async (
	req: Request<{ id: User['_id'] }>,
	res: Response<GetUserTicketsResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;

		const tickets: Ticket[] = await TicketModel.find({ user: id }).sort({ date: 1 }).populate('event').exec();

		const ticketsDto: TicketDto[] = tickets.map((t: Ticket) => toTicketDto(t));

		res.status(200).json({
			status: 'success',
			data: {
				results: ticketsDto.length,
				tickets: ticketsDto,
			},
		});
	} catch (err) {
		res.status(500).json({
			status: 'fail',
			message: err.message,
		});
	}
};

export const groupAvailableSectors = async (
	req: Request<{ eventId: Event['_id'] }>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { eventId } = req.params;
		const tickets: Ticket[] = await TicketModel.find({ event: eventId }).select('-__v').exec();
		const event: Event | null = await EventModel.findOne({ _id: eventId }).select('sectors -_id').exec(); // to może być nullem
		const sectorAvailable = event?.sectors;

		const groupedSectors = Object.groupBy(tickets, ({ seating }) => seating.sector);
		const occupiedSectors = Object.entries(groupedSectors).reduce((acc: any, [key, items]) => {
			acc[key] = items.length;
			return acc;
		}, {});

		const countCapacity = sectorAvailable.length * COUNT_BLOCKS * COUNT_SEAT;

		const freeSectorsCount: any = sectorAvailable.reduce((acc: any, sector: any) => {
			const occupied = occupiedSectors[sector] || 0;
			acc[sector] = countCapacity - occupied;
			return acc;
		}, {});

		const ticketsDto: TicketDto[] = tickets.map((t: Ticket) => toTicketDto(t));

		res.status(200).json({
			status: 'success',
			data: {
				results: ticketsDto.length,
				freeSectorsCount,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const getOccupiedSeats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { eventId, sector, block } = req.params;

		const tickets: Ticket[] = await TicketModel.find({
			event: eventId,
			'seating.sector': sector,
			'seating.block': block,
		}).select('-__v');

		const occupiedSeats: number[] = tickets.map((t: Ticket) => Number(t.seating.seat));

		const sortedOccupiedSeats: number[] = occupiedSeats.sort((a: number, b: number) => a - b);

		res.status(200).json({
			status: 'success',
			data: {
				results: sortedOccupiedSeats.length,
				occupiedSeats: sortedOccupiedSeats,
			},
		});
	} catch (err) {
		next(err);
	}
};
