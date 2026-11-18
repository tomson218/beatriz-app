import type { FacebookLoginData, FacebookLoginRequest } from '@beatriz/shared/auth';

/**
 * Sprawdza czy dane logowania przez Facebooka są kompletne (token i profil z identyfikatorami oraz e-mailem).
 */
export function isFacebookDataReady(data: FacebookLoginData): data is FacebookLoginRequest {
	const { tokens, userProfile } = data;

	return Boolean(tokens?.accessToken && tokens.userID && userProfile?.id && userProfile.email);
}
