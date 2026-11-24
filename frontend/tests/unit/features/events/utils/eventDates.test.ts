import { calcDatePost } from '@/features/events/utils/calcDatePost';
import { checkEventIsNew } from '@/features/events/utils/checkEventIsNew';
import { parseEventDate } from '@/features/events/utils/eventDate';

const NOW = new Date('2026-06-01T12:00:00.000Z');
const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const ago = (ms: number): Date => new Date(NOW.getTime() - ms);

beforeEach(() => {
	vi.useFakeTimers({ toFake: ['Date'] });
	vi.setSystemTime(NOW);
});

afterEach(() => {
	vi.useRealTimers();
});

describe('calcDatePost', () => {
	it.each([
		['30 minutes', ago(30 * 60 * 1000), '0 h'],
		['5 hours', ago(5 * HOUR_MS), '5 h'],
		['23.9 hours', ago(24 * HOUR_MS - 1), '23 h'],
		['exactly 1 day', ago(DAY_MS), '1 days'],
		['29 days', ago(29 * DAY_MS), '29 days'],
		['30 days', ago(30 * DAY_MS), '1 months'],
		['359 days', ago(359 * DAY_MS), '11 months'],
		['360 days', ago(360 * DAY_MS), '1 years'],
		['3 years', ago(3 * 360 * DAY_MS), '3 years'],
	])('describes a post from %s ago as %j', (_label, date, expected) => {
		const result = calcDatePost(date.toISOString());

		expect(result).toBe(expected);
	});
});

describe('checkEventIsNew', () => {
	it.each([
		['today', ago(0), true],
		['exactly 7 days ago', ago(7 * DAY_MS), true],
		['8 days ago', ago(8 * DAY_MS), false],
	])('an event added %s is new: %s', (_label, date, expected) => {
		const result = checkEventIsNew(date);

		expect(result).toBe(expected);
	});
});

describe('parseEventDate', () => {
	it('parses a date string and keeps Date objects as dates', () => {
		const result = [parseEventDate('2026-07-15T20:00:00.000Z'), parseEventDate(NOW)];
		const expected = [new Date('2026-07-15T20:00:00.000Z'), NOW];

		expect(result).toEqual(expected);
	});
});
