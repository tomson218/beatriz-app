import type { Event, EventType } from '@beatriz/shared/events';

export interface EventRouteParams {
	id: string;
}

export type EventWithDiscount = Event & { discount?: number };

/** Dane z formularza tworzenia wydarzenia (multipart): liczby i listy przychodzą jako napisy. */
export interface CreateEventInput {
	name: string;
	date: string;
	description: string;
	type: EventType;
	seatRequired: boolean;
	star: string;
	sectors: string;
	child: string;
	normal: string;
	vip: string;
}
