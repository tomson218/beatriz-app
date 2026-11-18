import type { EventType } from '@beatriz/shared/events';

// Kontrakt API współdzielony z frontendem: encje, DTO, requesty i response'y.
export type {
	CreateEventRequest,
	DeleteEventResponse,
	Event,
	EventDto,
	EventIdParams,
	EventRequest,
	EventResponse,
	EventType,
	GetAllEventsResponse,
	UpdateEventRequest,
} from '@beatriz/shared/events';

export interface EventRouteParams {
	id: string;
}

/** Dane z formularza tworzenia wydarzenia (multipart): liczby i listy przychodzą jako napisy. */
export interface CreateEventInput {
	name: string;
	date: string;
	description: string;
	type: EventType;
	seatRequired: string | boolean;
	star: string;
	sectors: string;
	child: string;
	normal: string;
	vip: string;
}
