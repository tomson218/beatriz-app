import { getStoredDiscountCode } from '@/features/orders/utils/discountCode';

describe('getStoredDiscountCode', () => {
	it('returns the code saved in the cart', () => {
		localStorage.setItem('code', JSON.stringify('PROMO20'));

		const result = getStoredDiscountCode();
		const expected = 'PROMO20';

		expect(result).toBe(expected);
	});

	it.each([
		['nothing is saved', null],
		['an empty string is saved', JSON.stringify('')],
		['a number is saved', JSON.stringify(20)],
		['null is saved', 'null'],
		['the value is not valid JSON', 'PROMO20'],
	])('returns undefined when %s', (_label, stored) => {
		if (stored !== null) localStorage.setItem('code', stored);

		const result = getStoredDiscountCode();

		expect(result).toBeUndefined();
	});
});
