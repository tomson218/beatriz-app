import { beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { verifyFacebookToken } from '../../../utils/facebookAuth.ts';

vi.mock('axios', () => ({ default: { get: vi.fn() } }));

const nowInSeconds = () => Math.floor(Date.now() / 1000);

const tokens = (overrides: Record<string, unknown> = {}) =>
	({
		accessToken: 'fb-token',
		userID: 'fb-user-1',
		data_access_expiration_time: nowInSeconds() + 3600,
		...overrides,
	}) as never;

describe('verifyFacebookToken', () => {
	beforeEach(() => {
		vi.spyOn(console, 'log').mockImplementation(() => {});
	});

	it('returns true when the token belongs to the user and has not expired', async () => {
		vi.mocked(axios.get).mockResolvedValue({ data: { id: 'fb-user-1' } });

		const result = await verifyFacebookToken(tokens());
		const expected = true;

		expect(result).toBe(expected);
	});

	it('asks the Facebook Graph API about the token', async () => {
		vi.mocked(axios.get).mockResolvedValue({ data: { id: 'fb-user-1' } });

		await verifyFacebookToken(tokens());
		const result = vi.mocked(axios.get).mock.calls[0];
		const expected = ['https://graph.facebook.com/me', { params: { access_token: 'fb-token' } }];

		expect(result).toEqual(expected);
	});

	it.each([
		['the token belongs to another user', { data: { id: 'someone-else' } }, {}],
		['data access has expired', { data: { id: 'fb-user-1' } }, { data_access_expiration_time: nowInSeconds() - 1 }],
		['the expiration time is missing', { data: { id: 'fb-user-1' } }, { data_access_expiration_time: undefined }],
	])('returns false when %s', async (_label, response, tokenOverrides) => {
		vi.mocked(axios.get).mockResolvedValue(response);

		const result = await verifyFacebookToken(tokens(tokenOverrides));
		const expected = false;

		expect(result).toBe(expected);
	});

	it('returns false instead of throwing when Facebook rejects the token', async () => {
		vi.mocked(axios.get).mockRejectedValue(new Error('Invalid OAuth access token'));

		const result = await verifyFacebookToken(tokens());
		const expected = false;

		expect(result).toBe(expected);
	});
});
