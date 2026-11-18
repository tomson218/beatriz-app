import axios from 'axios';
import type { FacebookTokens } from '@beatriz/shared/auth';

const FACEBOOK_GRAPH_ME_URL = 'https://graph.facebook.com/me';

/**
 * Sprawdza w Facebook Graph API, czy token należy do wskazanego użytkownika i nie wygasł.
 * Błąd sieci lub odrzucony token oznacza `false` (nigdy wyjątek).
 */
export const verifyFacebookToken = async (tokens: FacebookTokens): Promise<boolean> => {
	try {
		const response = await axios.get(FACEBOOK_GRAPH_ME_URL, { params: { access_token: tokens.accessToken } });

		const currentTime = Math.floor(Date.now() / 1000);
		const expirationTime = tokens.data_access_expiration_time ?? 0;

		const isSameUser = response.data.id === tokens.userID;
		const isNotExpired = expirationTime > currentTime;

		return isSameUser && isNotExpired;
	} catch (err) {
		console.log(err);
		return false;
	}
};
