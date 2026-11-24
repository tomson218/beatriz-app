import {
	NO_SEAT,
	buildSeatsUrl,
	hasNoSelectedSeats,
	isNoSeatPlaceholder,
	isSeatOccupied,
	isSeatSelected,
	parseInitialSelectedSeats,
} from '@/features/tickets/utils/seats';

describe('parseInitialSelectedSeats', () => {
	it('parses a comma-separated list of seat numbers', () => {
		const result = parseInitialSelectedSeats('1,5,12');
		const expected = [1, 5, 12];

		expect(result).toEqual(expected);
	});

	it.each([undefined, '', '0'])('returns no seats for %j', seats => {
		const result = parseInitialSelectedSeats(seats);
		const expected: number[] = [];

		expect(result).toEqual(expected);
	});
});

describe('isSeatOccupied / isSeatSelected', () => {
	it.each([
		[5, [1, 5, 9], true],
		[2, [1, 5, 9], false],
		[1, [], false],
	])('seat %s in %j -> %s', (seat, seats, expected) => {
		const result = [isSeatOccupied(seat, seats), isSeatSelected(seat, seats)];

		expect(result).toEqual([expected, expected]);
	});
});

describe('hasNoSelectedSeats', () => {
	it.each([
		[[], true],
		[[3], false],
	])('%j -> %s', (seats, expected) => {
		const result = hasNoSelectedSeats(seats);

		expect(result).toBe(expected);
	});
});

describe('buildSeatsUrl', () => {
	it('builds the seats URL with all parameters', () => {
		const result = buildSeatsUrl('/seats', 'event-1', 'A', 'blue', [3, 7]);
		const expected = '/seats?eventId=event-1&sector=A&block=blue&seats=3,7';

		expect(result).toBe(expected);
	});

	it('leaves the seats parameter empty when nothing is selected', () => {
		const result = buildSeatsUrl('/seats', 'event-1', 'A', 'blue', []);
		const expected = '/seats?eventId=event-1&sector=A&block=blue&seats=';

		expect(result).toBe(expected);
	});
});

describe('isNoSeatPlaceholder', () => {
	it.each([
		[NO_SEAT, true],
		['12', false],
		['', false],
	])('%j -> %s', (seat, expected) => {
		const result = isNoSeatPlaceholder(seat);

		expect(result).toBe(expected);
	});
});
