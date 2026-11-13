import type { Event } from '../models/eventModel.ts';
import type { SuccessList, SuccessItem, ErrorResponse } from './users.ts';

export type EventDto = Pick<
	Event,
	'_id' | 'name' | 'description' | 'star' | 'date' | 'image' | 'seatRequired' | 'sectors' | 'prices' | 'type'
> & { discount: number };

export type GetAllEventsResponse = SuccessList<'events'> | ErrorResponse;

export type GetEventResponse = SuccessItem<'event'> | ErrorResponse;

export type CreateEventRequest = Pick<
	EventDto,
	'date' | 'description' | 'seatRequired' | 'sectors' | 'type' | 'name' | 'star'
>;

export type CreateEventResponse = (SuccessItem<'event'> & { file: any }) | ErrorResponse;

export type UpdateEventRequest = Pick<EventDto, 'description'>;

export type UpdateEventResponse = SuccessItem<'event'> | ErrorResponse;

type DeleteEventRequest = {};

type DeleteEventResponse = {}; // | { status: 'error' | 'fail'; message: string };
