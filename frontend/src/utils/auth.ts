import type { FacebookLoginData } from '@beatriz/shared/auth';

/**
 * Sprawdza czy dane logowania przez Facebooka są kompletne (token i profil).
 */
export function isFacebookDataReady(data: FacebookLoginData): boolean {
	return data.tokens !== null && data.userProfile !== null;
}
