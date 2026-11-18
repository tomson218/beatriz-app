import EventModel from './events.model.ts';
import { calcDiscountPrice, calcPricesAfterDiscount } from '../../utils/discounts.ts';
import { validatePositiveNumber } from '../../utils/validateNumbers.ts';
import type { CreateEventInput, Event } from './events.type.ts';

/** Zamienia listę rozdzieloną przecinkami na tablicę bez zbędnych spacji. */
const parseCommaSeparatedList = (value: string): string[] => value.split(',').map(item => item.trim());

const requireEvent = <T>(event: T | null): T => {
	if (!event) {
		throw Object.assign(new Error('No event found with that ID'), { statusCode: 404 });
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
	return requireEvent(await EventModel.findByIdAndUpdate(id, { description }, { new: true }));
};

export const deleteEventById = async (id: string): Promise<void> => {
	requireEvent(await EventModel.findByIdAndDelete(id));
};
