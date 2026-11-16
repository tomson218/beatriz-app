import type { SuccessItem, SuccessList } from '@/common';

export interface Sector {
	type: string;
}

export interface Prices {
	child: number;
	normal: number;
	VIP: number;
}

export type EventType = 'concert' | 'theater' | 'opera' | 'musical' | 'festival' | 'other';

export interface EventFilter {
	date: string;
	name: Event['name'];
	star: Event['star'][number];
	minPrice: number;
	maxPrice: number;
	type: EventType[];
	seatRequired: Event['seatRequired'][];
}

export interface Event {
	_id: string;
	name: string;
	date: string | Date;
	star: string[];
	description: string;
	seatRequired: boolean;
	sectors: string[];
	image: string;
	prices: Prices;
	type: EventType;
	createdAt?: string;
	updatedAt?: string;
}

export interface EventDto extends Omit<Event, '_id'> {
	_id: string;
}

export interface EventIdParams {
	eventId: Event["_id"];
}

export type GetAllEventsResponse = SuccessList<EventDto>;

export type GetEventResponse = SuccessItem<EventDto>;

export interface CreateEventRequest {
	name: string;
	date: string;
	star: string[];
	description: string;
	seatRequired: boolean;
	sectors: string[];
	image?: string;
	prices: Prices;
	type: EventType;
}

export type CreateEventResponse = SuccessItem<EventDto>;

export interface UpdateEventRequest {
	name?: string;
	date?: string;
	star?: string[];
	description?: string;
	seatRequired?: boolean;
	sectors?: string[];
	image?: string;
	prices?: Prices;
	type?: EventType;
}

export type UpdateEventResponse = SuccessItem<EventDto>;

export type DeleteEventRequest = EventIdParams;

export interface DeleteEventResponse {
	message: string;
}
