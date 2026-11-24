import { getItemLocalStorage, setItemLocalStorage } from '@/shared/utils/localStorage';

describe('setItemLocalStorage / getItemLocalStorage', () => {
	it.each([
		['a string', 'token-123'],
		['a number', 42],
		['an object', { id: 'user-1', roles: ['admin'] }],
		['an array', [1, 2, 3]],
	])('saves and reads back %s', (_label, value) => {
		setItemLocalStorage('key', value);

		const result = getItemLocalStorage('key');
		const expected = value;

		expect(result).toEqual(expected);
	});

	it('stores values as JSON', () => {
		setItemLocalStorage('token', 'abc');

		const result = localStorage.getItem('token');
		const expected = '"abc"';

		expect(result).toBe(expected);
	});

	it('returns null for a missing key', () => {
		const result = getItemLocalStorage('missing');

		expect(result).toBeNull();
	});

	it('returns a legacy raw (non-JSON) string as it is', () => {
		localStorage.setItem('user-id', '6712bb5ae030df46e2e18e66');

		const result = getItemLocalStorage('user-id');
		const expected = '6712bb5ae030df46e2e18e66';

		expect(result).toBe(expected);
	});
});
