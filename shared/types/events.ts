import type { SuccessItem, SuccessList } from '@/types/common';
import { Types, type InferSchemaType } from 'mongoose';
import { eventSchema } from '@/schemas/eventSchema';
import { EVENT_TYPES } from '@/enums/eventTypes';

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

export type GetAllEventsResponse = SuccessList<EventDto>;

export type EventResponse = SuccessItem<EventDto>;

export type EventRequest = Pick<Event, 'name' | 'star' | 'description' | 'seatRequired' | 'sectors' | 'prices' | 'type'> & {
	date: string;
	image?: string;
};

export type CreateEventRequest = EventRequest;

export type UpdateEventRequest = Partial<Pick<Event, 'name' | 'date' | 'star' | 'description' | 'seatRequired' | 'sectors' | 'image' | 'prices' | 'type'>>;

export interface DeleteEventResponse {
	message: string;
}
