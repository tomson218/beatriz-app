import EventModel from '../models/eventModel.ts';
import AppError from '../utils/appError.ts';
import { calcDiscountPrice, calcPricesAfterDiscount } from '../utils/discounts.ts';
import { validatePositiveNumber } from '../utils/validateNumbers.ts';
import type { Event, EventType } from '@beatriz/shared/events';

/** Dane z formularza tworzenia wydarzenia (multipart): liczby i listy przychodzą jako napisy. */
interface CreateEventInput {
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

/** Zamienia listę rozdzieloną przecinkami na tablicę bez zbędnych spacji. */
const parseCommaSeparatedList = (value: string): string[] => value.split(',').map(item => item.trim());

const requireEvent = <T>(event: T | null): T => {
	if (!event) {
		throw new AppError('No event found with that ID', 404);
	}

	return event;
};

/** Dolicza do wydarzenia rabat (lub dopłatę) zależny od liczby dni do wydarzenia i przelicza ceny. */
const withDiscountedPrices = (event: Event) => {
	const discount = calcDiscountPrice(event.date);

	return { ...event, discount, prices: calcPricesAfterDiscount(discount, event.prices) };
};

export const getUpcomingEvents = async () => {
	const events: Event[] = await EventModel.find({ date: { $gte: new Date() } })
		.sort({ date: 1 })
		.lean();

	return events.map(withDiscountedPrices);
};

export const getEventById = async (id: string) => {
	const event: Event | null = await EventModel.findById(id).select('-__v').lean();

	return withDiscountedPrices(requireEvent(event));
};

export const createEvent = async (input: CreateEventInput, imageFilename?: string): Promise<Event> => {
	const childPrice = Number(input.child);
	const normalPrice = Number(input.normal);
	const vipPrice = Number(input.vip);

	validatePositiveNumber(childPrice, 'Cena biletu dziecięcego');
	validatePositiveNumber(normalPrice, 'Cena biletu normalnego');
	validatePositiveNumber(vipPrice, 'Cena biletu VIP');

	return EventModel.create({
		name: input.name,
		date: input.date,
		description: input.description,
		type: input.type,
		seatRequired: input.seatRequired,
		image: imageFilename,
		prices: { child: childPrice, normal: normalPrice, VIP: vipPrice },
		sectors: parseCommaSeparatedList(input.sectors),
		star: parseCommaSeparatedList(input.star),
	});
};

export const updateEventDescription = async (id: string, description: string): Promise<Event> => {
	return requireEvent(await EventModel.findByIdAndUpdate(id, { description }));
};

export const deleteEventById = async (id: string): Promise<void> => {
	requireEvent(await EventModel.findByIdAndDelete(id));
};
