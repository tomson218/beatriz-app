import type { EventDto } from '@beatriz/shared/events';
import type { EventWithDiscount } from './events.type.ts';

export const toEventDto = (event: EventWithDiscount): EventDto => ({
	_id: event._id.toString(),
	name: event.name,
	description: event.description,
	star: event.star,
	date: event.date,
	image: event.image,
	seatRequired: event.seatRequired,
	sectors: event.sectors,
	prices: event.prices,
	type: event.type,
	discount: event.discount,
});
