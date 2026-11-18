import type { ItemResponse, ListResponse } from '#types/common';
import type { Types, InferSchemaType } from 'mongoose';
import type { eventSchema } from '#schemas/eventSchema';
import type { EVENT_TYPES } from '#enums/eventTypes';

export type Event = InferSchemaType<typeof eventSchema> & { _id: Types.ObjectId };
export type EventType = (typeof EVENT_TYPES)[number];

export interface EventDto extends Omit<Event, '_id'> {
	_id: string;
}

export interface EventIdParams {
	eventId: Event["_id"];
}

export interface EventFilter {
	date: string;
	name: Event['name'];
	star: Event['star'][number];
	minPrice: number;
	maxPrice: number;
	type: EventType[];
	seatRequired: Event['seatRequired'][];
}

export type GetAllEventsResponse = ListResponse<'events', EventDto>;

export type EventResponse = ItemResponse<'event', EventDto>;

export type EventRequest = Pick<Event, 'name' | 'star' | 'description' | 'seatRequired' | 'sectors' | 'prices' | 'type'> & {
	date: string;
	image?: string;
};

export type CreateEventRequest = EventRequest;

export type UpdateEventRequest = Partial<Pick<Event, 'name' | 'date' | 'star' | 'description' | 'seatRequired' | 'sectors' | 'image' | 'prices' | 'type'>>;

export interface DeleteEventResponse {
	message: string;
}
