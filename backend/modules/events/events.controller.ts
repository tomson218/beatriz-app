import type { NextFunction, Request, Response } from 'express';
import { toEventDto } from './events.mapper.ts';
import {
	createEvent as createNewEvent,
	deleteEventById,
	getEventById,
	getUpcomingEvents,
	updateEventDescription,
} from './events.service.ts';
import type { EventRouteParams } from './events.type.ts';

export const getAllEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const events = await getUpcomingEvents();

		res.status(200).json({
			status: 'success',
			data: { results: events.length, events: events.map(toEventDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const getEvent = async (req: Request<EventRouteParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const event = await getEventById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { event: toEventDto(event) },
		});
	} catch (error) {
		next(error);
	}
};

export const createEvent = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const event = await createNewEvent(req.body, req.file?.filename);

		res.status(201).json({
			status: 'success',
			data: { event: toEventDto(event) },
		});
	} catch (error) {
		next(error);
	}
};

export const updateEvent = async (req: Request<EventRouteParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const event = await updateEventDescription(req.params.id, req.body.description);

		res.status(200).json({
			status: 'success',
			data: { event: toEventDto(event) },
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
