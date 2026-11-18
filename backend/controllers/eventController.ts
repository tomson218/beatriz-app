import { catchAsync } from '../utils/catchAsync.ts';
import { itemResponse, listResponse } from '../utils/apiResponse.ts';
import { toEventDto } from '../mappers/eventMapper.ts';
import {
	createEvent as createNewEvent,
	deleteEventById,
	getEventById,
	getUpcomingEvents,
	updateEventDescription,
} from '../services/eventService.ts';

export const getAllEvents = catchAsync(async (req, res) => {
	const events = await getUpcomingEvents();

	res.status(200).json(listResponse('events', events));
});

export const getEvent = catchAsync<{ id: string }>(async (req, res) => {
	const event = await getEventById(req.params.id);

	res.status(200).json(itemResponse('event', toEventDto(event)));
});

export const createEvent = catchAsync(async (req, res) => {
	const event = await createNewEvent(req.body, req.file?.filename);

	res.status(201).json(itemResponse('event', toEventDto(event)));
});

export const updateEvent = catchAsync<{ id: string }>(async (req, res) => {
	const event = await updateEventDescription(req.params.id, req.body.description);

	res.status(200).json(itemResponse('event', toEventDto(event)));
});

export const deleteEvent = catchAsync<{ id: string }>(async (req, res) => {
	await deleteEventById(req.params.id);

	res.status(204).json({ status: 'success', data: null });
});
