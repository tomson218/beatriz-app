import TicketModel from '../models/ticketModel.ts';
import EventModel from '../models/eventModel.ts';
import { COUNT_BLOCKS, COUNT_SEAT } from '../capacityHall.ts';
import { type Request, type Response, type NextFunction } from 'express';

export const getAllTickets = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tickets = await TicketModel.find();

		res.status(200).json({
			status: 'success',
			tickets,
		});
	} catch (error) {
		res.status(500).json({
			status: 'fail',
			message: 'Internal Server Error',
		});
	}
};

export const getUserTickets = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const tickets = await TicketModel.find({ user: id }).sort({ date: 1 }).populate('event').exec();

		res.status(200).json({
			status: 'success',
			results: tickets.length,
			tickets,
		});
	} catch (err) {
		res.status(500).json({
			status: 'fail',
			message: err.message,
		});
	}
};

export const groupAvailableSectors = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { eventId } = req.params;
		const tickets = await TicketModel.find({ event: eventId }).select('-__v').exec();
		const event = await EventModel.findOne({ _id: eventId }).select('sectors -_id').exec();
		const sectorAvailable = event?.sectors;

		const groupedSectors = Object.groupBy(tickets, ({ seating }) => seating.sector);
		const occupiedSectors = Object.entries(groupedSectors).reduce((acc, [key, items]) => {
			acc[key] = items.length;
			return acc;
		}, {});

		const countCapacity = sectorAvailable.length * COUNT_BLOCKS * COUNT_SEAT;

		const freeSectorsCount = sectorAvailable.reduce((acc, sector) => {
			const occupied = occupiedSectors[sector] || 0;
			acc[sector] = countCapacity - occupied;
			return acc;
		}, {});

		res.status(200).json({
			status: 'success',
			results: tickets.length,
			freeSectorsCount,
		});
	} catch (err) {
		next(err);
	}
};

export const getOccupiedSeats = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { eventId, sector, block } = req.params;

		const tickets = await TicketModel.find({
			event: eventId,
			'seating.sector': sector,
			'seating.block': block,
		}).select('-__v');

		const occupiedSeats = tickets.map(t => Number(t.seating.seat));

		occupiedSeats.sort((a, b) => a - b);

		res.status(200).json({
			status: 'success',
			results: occupiedSeats.length,
			occupiedSeats,
		});
	} catch (err) {
		next(err);
	}
};
