import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import type { Types } from 'mongoose';
import type { Request, Response } from 'express';
import type { UserDto } from '@beatriz/shared/users';

const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

/** Zawartość tokenów JWT wystawianych przez aplikację. */
interface TokenPayload {
	id: Types.ObjectId;
}

const getRefreshTokenSecret = (): string => process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

export const signToken = (userId: Types.ObjectId): string => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

export const signRefreshToken = (userId: Types.ObjectId): string => {
	return jwt.sign({ id: userId }, getRefreshTokenSecret(), {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
	});
};

export const verifyAccessToken = async (token: string): Promise<TokenPayload> => {
	return (await promisify(jwt.verify)(token, process.env.JWT_SECRET)) as TokenPayload;
};

export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
	return (await promisify(jwt.verify)(token, getRefreshTokenSecret())) as TokenPayload;
};

/** Zwraca token z nagłówka `Authorization: Bearer <token>` albo `undefined`, gdy nagłówka brak. */
export const getBearerToken = (req: Request): string | undefined => {
	const hasBearerHeader = req.headers.authorization?.startsWith('Bearer');

	if (!hasBearerHeader) return undefined;

	return req.headers.authorization.split(' ')[1];
};

/** Odczytuje refresh token z nagłówka `Cookie` (bez zależności od `cookie-parser`). */
export const getRefreshTokenFromRequest = (req: Request): string | undefined => {
	const cookieHeader = req.headers.cookie ?? '';

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
	const isProduction = process.env.NODE_ENV === 'production';

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

/** Wystawia access i refresh token (refresh trafia do ciasteczka `httpOnly`) i odsyła odpowiedź z użytkownikiem. */
export const createSendToken = (user: UserDto, statusCode: number, res: Response): void => {
	const accessToken = signToken(user._id);
	const refreshToken = signRefreshToken(user._id);

	setRefreshTokenCookie(res, refreshToken);

	res.status(statusCode).json({
		status: 'success',
		data: {
			accessToken,
			user,
		},
	});
};
