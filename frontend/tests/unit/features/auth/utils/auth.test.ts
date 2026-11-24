import type { FacebookLoginData } from '@beatriz/shared/auth';
import { isFacebookDataReady } from '@/features/auth/utils/auth';

const completeData: FacebookLoginData = {
	tokens: { accessToken: 'fb-token', userID: 'fb-1' },
	userProfile: { id: 'fb-1', email: 'jan@example.com', name: 'Jan Kowalski' },
};

describe('isFacebookDataReady', () => {
	it('returns true when the tokens and the profile are complete', () => {
		const result = isFacebookDataReady(completeData);
		const expected = true;

		expect(result).toBe(expected);
	});

	it.each([
		['no tokens', { ...completeData, tokens: null }],
		['no profile yet', { ...completeData, userProfile: null }],
		['no access token', { ...completeData, tokens: { userID: 'fb-1' } }],
		['no user ID', { ...completeData, tokens: { accessToken: 'fb-token' } }],
		['no profile id', { ...completeData, userProfile: { email: 'jan@example.com' } }],
		['no email (not shared by the user)', { ...completeData, userProfile: { id: 'fb-1' } }],
	])('returns false with %s', (_label, data) => {
		const result = isFacebookDataReady(data as FacebookLoginData);
		const expected = false;

		expect(result).toBe(expected);
	});
});
