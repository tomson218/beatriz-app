import type { EventDto, EventFilter } from '@beatriz/shared/events';
import { matchesEventFilter } from '@/features/events/utils/eventFilter';

const event = (overrides: Partial<EventDto> = {}): EventDto =>
	({
		_id: 'event-1',
		name: 'Letni Koncert Rockowy',
		date: '2026-07-15T20:00:00.000Z',
		type: 'concert',
		star: ['Kortez', 'Mrozu'],
		seatRequired: true,
		prices: { normal: 150, VIP: 300, child: 80 },
		...overrides,
	}) as EventDto;

const emptyFilter: EventFilter = {
	date: '',
	name: '',
	star: '',
	minPrice: 0,
	maxPrice: Number.POSITIVE_INFINITY,
	type: [],
	seatRequired: [],
};

const filter = (overrides: Partial<EventFilter>): EventFilter => ({ ...emptyFilter, ...overrides });

describe('matchesEventFilter', () => {
	it('matches every event when the filter is empty', () => {
		const result = matchesEventFilter(event(), emptyFilter);
		const expected = true;

		expect(result).toBe(expected);
	});

	it.each([
		['the same day (time ignored)', filter({ date: '2026-07-15T08:00:00.000Z' }), true],
		['another day', filter({ date: '2026-07-16' }), false],
		['part of the name, ignoring case', filter({ name: 'koncert' }), true],
		['a name it does not contain', filter({ name: 'Jazz' }), false],
		['one of the selected types', filter({ type: ['festival', 'concert'] }), true],
		['a type that is not selected', filter({ type: ['opera'] }), false],
		['part of a star name, ignoring case and spaces', filter({ star: '  korT ' }), true],
		['a star who does not perform', filter({ star: 'Podsiadło' }), false],
		['the seat requirement', filter({ seatRequired: [true] }), true],
		['the opposite seat requirement', filter({ seatRequired: [false] }), false],
		['a price range that includes the normal price', filter({ minPrice: 100, maxPrice: 150 }), true],
		['a minimum price above the normal price', filter({ minPrice: 151 }), false],
		['a maximum price below the normal price', filter({ maxPrice: 149 }), false],
	])('checks %s', (_label, eventFilter, expected) => {
		const result = matchesEventFilter(event(), eventFilter);

		expect(result).toBe(expected);
	});

	it('requires all criteria to match at once', () => {
		const result = matchesEventFilter(event(), filter({ name: 'Rock', type: ['opera'] }));
		const expected = false;

		expect(result).toBe(expected);
	});

	it('treats an event without prices as costing 0 PLN', () => {
		const result = [
			matchesEventFilter(event({ prices: undefined }), filter({ maxPrice: 0 })),
			matchesEventFilter(event({ prices: undefined }), filter({ minPrice: 1 })),
		];
		const expected = [true, false];

		expect(result).toEqual(expected);
	});
});
