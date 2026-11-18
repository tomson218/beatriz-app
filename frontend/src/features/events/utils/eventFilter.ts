import type { EventDto, EventFilter } from '@beatriz/shared/events';
import { parseEventDate } from './eventDate';

/** Zamienia datę na klucz dnia (`YYYY-MM-DD`), żeby porównywać dni niezależnie od godziny. */
const toDayKey = (date: string | Date): string => parseEventDate(date).toISOString().split('T')[0];

const matchesDate = (event: EventDto, filter: EventFilter): boolean => {
	const isDateFilterEmpty = !filter.date;

	if (isDateFilterEmpty) return true;

	const isSameDay = toDayKey(event.date) === toDayKey(filter.date);

	return isSameDay;
};

const matchesName = (event: EventDto, filter: EventFilter): boolean => {
	const isNameFilterEmpty = !filter.name;

	if (isNameFilterEmpty) return true;

	const isNameIncluded = event.name.toLowerCase().includes(filter.name.toLowerCase());

	return isNameIncluded;
};

const matchesType = (event: EventDto, filter: EventFilter): boolean => {
	const isTypeFilterEmpty = filter.type.length === 0;
	const isTypeSelected = filter.type.includes(event.type);

	return isTypeFilterEmpty || isTypeSelected;
};

const matchesStar = (event: EventDto, filter: EventFilter): boolean => {
	const isStarFilterEmpty = !filter.star;
	const isStarPerforming = event.star.includes(filter.star);

	return isStarFilterEmpty || isStarPerforming;
};

const matchesSeatRequired = (event: EventDto, filter: EventFilter): boolean => {
	const isSeatRequiredFilterEmpty = filter.seatRequired.length === 0;
	const isSeatRequiredSelected = filter.seatRequired.includes(event.seatRequired);

	return isSeatRequiredFilterEmpty || isSeatRequiredSelected;
};

const matchesPriceRange = (event: EventDto, filter: EventFilter): boolean => {
	const normalPrice = event.prices?.normal ?? 0;

	const isAboveMinPrice = normalPrice >= filter.minPrice;
	const isBelowMaxPrice = normalPrice <= filter.maxPrice;

	return isAboveMinPrice && isBelowMaxPrice;
};

/** Sprawdza czy wydarzenie spełnia wszystkie aktywne kryteria filtra (puste kryterium nie ogranicza wyników). */
export function matchesEventFilter(event: EventDto, filter: EventFilter): boolean {
	const isDateMatching = matchesDate(event, filter);
	const isNameMatching = matchesName(event, filter);
	const isTypeMatching = matchesType(event, filter);
	const isStarMatching = matchesStar(event, filter);
	const isSeatRequiredMatching = matchesSeatRequired(event, filter);
	const isPriceMatching = matchesPriceRange(event, filter);

	return (
		isDateMatching &&
		isNameMatching &&
		isTypeMatching &&
		isStarMatching &&
		isSeatRequiredMatching &&
		isPriceMatching
	);
}
