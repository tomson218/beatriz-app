import type { Event } from '../models/eventModel.ts';

type EventDto = Pick<
	Event,
	'_id' | 'name' | 'description' | 'star' | 'date' | 'image' | 'seatRequired' | 'sectors' | 'prices' | 'type'
> & { discount: number };

export type GetAllEventsResponse =
	| {
			status: 'success';
			results: number;
			events: EventDto[];
	  }
	| { status: 'error' | 'fail'; message: string };

export type GetEventResponse =
	| {
			status: 'success';
			event: EventDto;
	  }
	| { status: 'error' | 'fail'; message: string };

/* 		const { date, description, child, normal, seatRequired, sectors, star, vip, name, type } = req.body;  ---- chiod, nonroaml i vip oganrac */

export type CreateEventRequest = Pick<
	EventDto,
	'date' | 'description' | 'seatRequired' | 'sectors' | 'type' | 'name' | 'star'
>;

export type CreateEventResponse = [];

export type UpdateEventRequest = Pick<EventDto, 'description'>;

export type UpdateEventResponse = {}; // | { status: 'error' | 'fail'; message: string };

export type DeleteEventRequest = {};

export type DeleteEventResponse = {}; // | { status: 'error' | 'fail'; message: string };
