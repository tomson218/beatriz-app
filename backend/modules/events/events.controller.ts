import type { NextFunction, Request, Response } from 'express';
import { toEventDto } from './events.mapper.ts';
import {
	createEvent as createNewEvent,
	deleteEventById,
	findEventById,
	findUpcomingEvents,
	updateEventDescription,
} from './events.service.ts';
import type { Event, EventDto } from '@beatriz/shared/events';
import type { EventRouteParams, EventWithDiscount } from './events.type.ts';

export const getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const events: EventWithDiscount[] = await findUpcomingEvents();
		const eventsDto: EventDto[] = events.map(toEventDto);

		res.status(200).json({
			status: 'success',
			data: { results: eventsDto.length, events: eventsDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getEvent = async (req: Request<EventRouteParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const event: EventWithDiscount = await findEventById(req.params.id);
		const eventDto: EventDto = toEventDto(event);

		res.status(200).json({
			status: 'success',
			data: { event: eventDto },
		});
	} catch (error) {
		next(error);
	}
};

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const event: Event = await createNewEvent(req.body, req.file?.filename);
		const eventDto: EventDto = toEventDto(event);

		res.status(201).json({
			status: 'success',
			data: { event: eventDto },
		});
	} catch (error) {
		next(error);
	}
};

export const updateEvent = async (req: Request<EventRouteParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const event: Event = await updateEventDescription(req.params.id, req.body.description);
		const eventDto: EventDto = toEventDto(event);

		res.status(200).json({
			status: 'success',
			data: { event: eventDto },
		});
	} catch (error) {
		next(error);
	}
};

export const deleteEvent = async (req: Request<EventRouteParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		await deleteEventById(req.params.id);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
