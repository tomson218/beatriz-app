import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { calcDiscountPrice, calcPricesAfterDiscount } from '../../../utils/discounts.ts';

const NOW = new Date('2026-01-01T12:00:00Z');
const DAY_MS = 24 * 60 * 60 * 1000;
const inDays = (days: number): Date => new Date(NOW.getTime() + days * DAY_MS);

describe('calcDiscountPrice', () => {
	beforeEach(() => {
		vi.useFakeTimers();
		vi.setSystemTime(NOW);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it.each([
		[365, 0.25],
		[90, 0.25],
		[89, 0.15],
		[60, 0.15],
		[59, 0.1],
		[30, 0.1],
		[29, 1.1],
		[20, 1.1],
		[19, 1.2],
		[10, 1.2],
		[9, 1.3],
		[5, 1.3],
		[4, 0],
		[0, 0],
		[-10, 0],
	])('returns %s days before the event -> %s', (days, expected) => {
		const result = calcDiscountPrice(inDays(days));

		expect(result).toBe(expected);
	});

	it('counts only full days (89.9 days is still the 60-89 tier)', () => {
		const result = calcDiscountPrice(new Date(inDays(90).getTime() - 1));
		const expected = 0.15;

		expect(result).toBe(expected);
	});

	it('accepts a date string', () => {
		const result = calcDiscountPrice(inDays(100).toISOString() as unknown as Date);
		const expected = 0.25;

		expect(result).toBe(expected);
	});
});

describe('calcPricesAfterDiscount', () => {
	const prices = { normal: 100, VIP: 250, child: 55 };

	it('subtracts a fractional discount and rounds up', () => {
		const result = calcPricesAfterDiscount(0.15, prices);
		const expected = { normal: 85, VIP: 213, child: 47 };

		expect(result).toEqual(expected);
	});

	it('multiplies by a surcharge (>= 1) and rounds up', () => {
		const result = calcPricesAfterDiscount(1.3, prices);
		const expected = { normal: 130, VIP: 325, child: 72 };

		expect(result).toEqual(expected);
	});

	// Znany błąd: 100 * 1.1 = 110.00000000000001 w arytmetyce zmiennoprzecinkowej, więc Math.ceil daje 111 zamiast 110.
	// Gdy błąd zostanie naprawiony, ten test zacznie "nie failować": wtedy zamień `it.fails` na `it`.
	it.fails('BUG: a 10% surcharge on 100 PLN should give 110 PLN, not 111 PLN', () => {
		const result = calcPricesAfterDiscount(1.1, { normal: 100, VIP: 200 });
		const expected = { normal: 110, VIP: 220 };

		expect(result).toEqual(expected);
	});

	it('leaves prices unchanged when the discount is 0', () => {
		const result = calcPricesAfterDiscount(0, prices);
		const expected = prices;

		expect(result).toEqual(expected);
	});

	it('keeps prices unchanged for a multiplier of exactly 1', () => {
		const result = calcPricesAfterDiscount(1, prices);
		const expected = prices;

		expect(result).toEqual(expected);
	});

	it('returns an empty object for empty prices', () => {
		const result = calcPricesAfterDiscount(0.25, {});
		const expected = {};

		expect(result).toEqual(expected);
	});
});
