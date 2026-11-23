import { describe, expect, it } from 'vitest';
import { catchError } from '../../helpers/catchError.ts';
import { validateNonNegativeNumber, validatePositiveNumber } from '../../../utils/validateNumbers.ts';

describe('validatePositiveNumber', () => {
	it.each([1, 0.01, 1_000_000])('accepts %s', value => {
		const result = validatePositiveNumber(value, 'Cena');

		expect(result).toBeUndefined();
	});

	it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('rejects %s', value => {
		const result = catchError(() => validatePositiveNumber(value, 'Cena'));
		const expected = { message: 'Cena musi być liczbą dodatnią', statusCode: 400 };

		expect(result).toMatchObject(expected);
	});
});

describe('validateNonNegativeNumber', () => {
	it.each([0, 1, 0.5])('accepts %s', value => {
		const result = validateNonNegativeNumber(value, 'Limit');

		expect(result).toBeUndefined();
	});

	it.each([-0.01, -1, Number.NaN, Number.POSITIVE_INFINITY])('rejects %s', value => {
		const result = catchError(() => validateNonNegativeNumber(value, 'Limit'));
		const expected = { message: 'Limit nie może być liczbą ujemną', statusCode: 400 };

		expect(result).toMatchObject(expected);
	});
});
