import jwt, { type SignOptions } from 'jsonwebtoken';
import type { Request, Response } from 'express';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Zawartość tokenów JWT wystawianych przez aplikację. */
interface TokenPayload {
	id: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
}

const getAccessTokenSecret = (): string => process.env.JWT_SECRET as string;
const getRefreshTokenSecret = (): string => process.env.JWT_REFRESH_SECRET || getAccessTokenSecret();

export const createAuthTokens = (userId: string): AuthTokens => {
	const accessToken: string = jwt.sign({ id: userId }, getAccessTokenSecret(), {
		expiresIn: process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'],
	});
	const refreshToken: string = jwt.sign({ id: userId }, getRefreshTokenSecret(), {
		expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as SignOptions['expiresIn'],
	});

	return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): TokenPayload =>
	jwt.verify(token, getAccessTokenSecret()) as TokenPayload;

export const verifyRefreshToken = (token: string): TokenPayload =>
	jwt.verify(token, getRefreshTokenSecret()) as TokenPayload;

/** Zwraca token z nagłówka `Authorization: Bearer <token>` albo `undefined`, gdy nagłówka brak. */
export const getBearerToken = (req: Request): string | undefined => {
	const authorization: string | undefined = req.headers.authorization;

	return authorization?.startsWith('Bearer') ? authorization.split(' ')[1] : undefined;
};

/** Odczytuje refresh token z nagłówka `Cookie` (bez zależności od `cookie-parser`). */
export const getRefreshTokenFromRequest = (req: Request): string | undefined => {
	const cookieHeader: string = req.headers.cookie ?? '';

	const cookies = cookieHeader.split(';').reduce<Record<string, string>>((acc, item) => {
		const [key, ...rest] = item.trim().split('=');
		const isMalformedCookie = !key || rest.length === 0;

		if (isMalformedCookie) return acc;

		acc[key] = rest.join('=');
		return acc;
	}, {});

	return cookies[REFRESH_TOKEN_COOKIE_NAME];
};

const getRefreshTokenCookieOptions = () => {
	const isProduction: boolean = process.env.NODE_ENV === 'production';

	return {
		httpOnly: true,
		secure: isProduction,
		sameSite: isProduction ? ('none' as const) : ('lax' as const),
		path: '/',
		maxAge: REFRESH_TOKEN_MAX_AGE_MS,
	};
};

export const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
	res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getRefreshTokenCookieOptions());
};

export const clearRefreshTokenCookie = (res: Response): void => {
	res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, getRefreshTokenCookieOptions());
};
