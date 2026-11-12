import type { Event } from '../models/eventModel.ts';
import type { EventDto } from '../types/events.ts';

export const toEventDto = (event: Event): EventDto => ({
	_id: event._id,
	name: event.name,
	description: event.description,
	star: event.star,
	date: event.date,
	image: event.image,
	seatRequired: event.seatRequired,
	sectors: event.sectors,
	prices: event.prices,
	type: event.type,
	discount: event.discount, // anomalia jakaś
});
