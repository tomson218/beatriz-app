import { describe, expect, it } from 'vitest';
import { getNameBlock, getNameTypeTicket } from '../../../utils/formattings.ts';
import { formattedDate, formattedTime } from '../../../utils/formattingDate.ts';
import { getOfflinePaymentDeadline, getOverdueOrderDate } from '../../../utils/offlinePayment.ts';

describe('getNameBlock', () => {
	it.each([
		['blue', 'niebieska'],
		['green', 'zielona'],
		['yellow', 'żółta'],
	])('translates %s to %s', (block, expected) => {
		const result = getNameBlock(block);

		expect(result).toBe(expected);
	});

	it.each(['black', 'unknown', '', null, undefined])('falls back to "czarna" for %s', block => {
		const result = getNameBlock(block);
		const expected = 'czarna';

		expect(result).toBe(expected);
	});
});

describe('getNameTypeTicket', () => {
	it.each([
		['VIP', 'VIP'],
		['normal', 'Normalny'],
		['child', 'Dziecinny'],
	])('translates %s to %s', (type, expected) => {
		const result = getNameTypeTicket(type);

		expect(result).toBe(expected);
	});

	it.each(['senior', '', null, undefined])('falls back to "Unknown" for %s', type => {
		const result = getNameTypeTicket(type);
		const expected = 'Unknown';

		expect(result).toBe(expected);
	});
});

describe('formattedDate / formattedTime', () => {
	const date = new Date(2026, 10, 19, 9, 5);

	it('formats the date in Polish format', () => {
		const result = formattedDate(date);
		const expected = '19.11.2026';

		expect(result).toBe(expected);
	});

	it('formats the time as HH:mm', () => {
		const result = formattedTime(date);
		const expected = '09:05';

		expect(result).toBe(expected);
	});
});

describe('offline payment dates', () => {
	const HOURS_48_MS = 48 * 60 * 60 * 1000;

	it('sets the payment deadline 48 hours after the order', () => {
		const result = getOfflinePaymentDeadline(new Date('2026-11-19T10:00:00Z'));
		const expected = new Date('2026-11-21T10:00:00Z');

		expect(result).toEqual(expected);
	});

	it('treats orders older than 48 hours as overdue', () => {
		const before = Date.now();
		const result = getOverdueOrderDate().getTime();
		const after = Date.now();

		expect(result).toBeGreaterThanOrEqual(before - HOURS_48_MS);
		expect(result).toBeLessThanOrEqual(after - HOURS_48_MS);
	});
});
