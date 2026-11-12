import EventModel, { type Event } from '../models/eventModel.ts';
import AppError from '../utils/appError.ts';
import { type Request, type Response, type NextFunction } from 'express';
import { calcDiscountPrice, calcPricesAfterDiscount } from '../utils/discounts.ts';
import { toEventDto } from '../mappers/eventMapper.ts';
import type { EventDto } from '../types/events.ts';

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
	try {
		const events: Event[] = await EventModel.find({ date: { $gte: new Date() } })
			.sort({ date: 1 })
			.lean();

		const updatedEvents: EventDto[] = events.map(event => {
			const discount = calcDiscountPrice(event.date);
			const newPrices = calcPricesAfterDiscount(discount, event.prices);
			return { ...event, discount, prices: newPrices };
		});

		res.status(200).json({
			status: 'success',
			results: updatedEvents.length,
			events: updatedEvents,
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error',
		});
	}
};

export const getEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;

		const event: Event | null = await EventModel.findById(id).select('-__v').lean();

		if (!event) {
			return next(new AppError('No event found with that ID', 404));
		}

		const changedEvent = {
			...event,
			discount: calcDiscountPrice(event.date),
			prices: calcPricesAfterDiscount(calcDiscountPrice(event.date), event.prices),
		};

		const eventDto = toEventDto(changedEvent);

		res.status(200).json({
			status: 'success',
			event: eventDto,
		});
	} catch (err) {
		next(err);
	}
};

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		console.log(req.body);

		const { date, description, child, normal, seatRequired, sectors, star, vip, name, type } = req.body;

		const formattedStar = star.split(',').map((item: any) => item.trim());

		const sectorsArray = sectors.split(',').map((sector: any) => sector.trim());

		const newEvent: Event = await EventModel.create({
			date,
			description,
			prices: {
				child: Number(child),
				normal: Number(normal),
				VIP: Number(vip),
			},
			image: req?.file?.filename,
			name,
			type,
			seatRequired,
			sectors: sectorsArray,
			star: formattedStar,
		});

		const file = req.file;

		const newEventDto: EventDto = toEventDto(newEvent);

		res.status(201).json({
			status: 'success',
			newEvent: newEventDto,
			file,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	const { id } = req.params;

	const event: Event | null = await EventModel.findByIdAndDelete(id);

	if (!event) {
		return next(new AppError('No event found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const { id } = req.params;
		const { description } = req.body;

		const updatedEvent: Event | null = await EventModel.findByIdAndUpdate(id, { description });

		if (!updatedEvent) {
			return next(new AppError('No event found with that ID', 404));
		}

		const updatedEventDto: EventDto = toEventDto(updatedEvent);

		res.status(200).json({
			status: 'success',
			updatedEvent: updatedEventDto,
		});
	} catch (err) {
		next(err);
	}
};
