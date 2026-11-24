import { afterEach, describe, expect, it, vi } from 'vitest';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { catchError } from '../../helpers/catchError.ts';
import {
	clearRefreshTokenCookie,
	createAuthTokens,
	getBearerToken,
	getRefreshTokenFromRequest,
	setRefreshTokenCookie,
	verifyAccessToken,
	verifyRefreshToken,
} from '../../../utils/authTokens.ts';

const requestWithHeaders = (headers: Record<string, string | undefined>): Request =>
	({ headers }) as unknown as Request;

const lifetimeInSeconds = (token: string): number => {
	const { exp, iat } = jwt.decode(token) as jwt.JwtPayload;

	return exp! - iat!;
};

afterEach(() => {
	vi.unstubAllEnvs();
});

describe('createAuthTokens / verify*', () => {
	it('creates access and refresh tokens that carry the user id', () => {
		const { accessToken, refreshToken } = createAuthTokens('user-1');

		const result = [verifyAccessToken(accessToken).id, verifyRefreshToken(refreshToken).id];
		const expected = ['user-1', 'user-1'];

		expect(result).toEqual(expected);
	});

	it('uses JWT_EXPIRES_IN for the access token and 7 days by default for the refresh token', () => {
		const { accessToken, refreshToken } = createAuthTokens('user-1');

		const result = { access: lifetimeInSeconds(accessToken), refresh: lifetimeInSeconds(refreshToken) };
		const expected = { access: 15 * 60, refresh: 7 * 24 * 60 * 60 };

		expect(result).toEqual(expected);
	});

	it('uses JWT_REFRESH_EXPIRES_IN when set', () => {
		vi.stubEnv('JWT_REFRESH_EXPIRES_IN', '1h');

		const result = lifetimeInSeconds(createAuthTokens('user-1').refreshToken);
		const expected = 60 * 60;

		expect(result).toBe(expected);
	});

	it('signs the refresh token with JWT_REFRESH_SECRET when set, so it cannot be used as an access token', () => {
		vi.stubEnv('JWT_REFRESH_SECRET', 'separate-refresh-secret');
		const { accessToken, refreshToken } = createAuthTokens('user-1');

		const result = {
			refreshTokenUser: verifyRefreshToken(refreshToken).id,
			refreshAsAccess: catchError(() => verifyAccessToken(refreshToken)).message,
			accessAsRefresh: catchError(() => verifyRefreshToken(accessToken)).message,
		};
		const expected = {
			refreshTokenUser: 'user-1',
			refreshAsAccess: 'invalid signature',
			accessAsRefresh: 'invalid signature',
		};

		expect(result).toEqual(expected);
	});

	it('rejects tokens signed with another secret', () => {
		const forged = jwt.sign({ id: 'admin' }, 'wrong-secret');

		const result = catchError(() => verifyAccessToken(forged));
		const expected = { name: 'JsonWebTokenError', message: 'invalid signature' };

		expect(result).toMatchObject(expected);
	});

	it('rejects expired tokens', () => {
		const expired = jwt.sign({ id: 'user-1', exp: Math.floor(Date.now() / 1000) - 10 }, 'test-access-secret');

		const result = catchError(() => verifyAccessToken(expired));
		const expected = { name: 'TokenExpiredError', message: 'jwt expired' };

		expect(result).toMatchObject(expected);
	});
});

describe('getBearerToken', () => {
	it('returns the token from the Authorization header', () => {
		const result = getBearerToken(requestWithHeaders({ authorization: 'Bearer abc.def' }));
		const expected = 'abc.def';

		expect(result).toBe(expected);
	});

	it.each([undefined, '', 'Basic abc', 'abc.def'])('returns undefined for header %s', authorization => {
		const result = getBearerToken(requestWithHeaders({ authorization }));

		expect(result).toBeUndefined();
	});
});

describe('getRefreshTokenFromRequest', () => {
	it('reads the refreshToken cookie among other cookies', () => {
		const result = getRefreshTokenFromRequest(
			requestWithHeaders({ cookie: 'theme=dark; refreshToken=abc.def; lang=pl' }),
		);
		const expected = 'abc.def';

		expect(result).toBe(expected);
	});

	it('keeps "=" characters inside the cookie value', () => {
		const result = getRefreshTokenFromRequest(requestWithHeaders({ cookie: 'refreshToken=a=b==' }));
		const expected = 'a=b==';

		expect(result).toBe(expected);
	});

	it.each([undefined, '', 'theme=dark', 'refreshToken', '=abc'])('returns undefined for cookie header %s', cookie => {
		const result = getRefreshTokenFromRequest(requestWithHeaders({ cookie }));

		expect(result).toBeUndefined();
	});
});

describe('refresh token cookie', () => {
	const mockResponse = () => {
		const res = { cookie: vi.fn(), clearCookie: vi.fn() };

		return { res, response: res as unknown as Response };
	};

	it('sets an httpOnly, lax, non-secure cookie outside production', () => {
		vi.stubEnv('NODE_ENV', 'development');
		const { res, response } = mockResponse();

		setRefreshTokenCookie(response, 'token');
		const result = res.cookie.mock.calls[0];
		const expected = [
			'refreshToken',
			'token',
			{ httpOnly: true, secure: false, sameSite: 'lax', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 },
		];

		expect(result).toEqual(expected);
	});

	it('sets a secure, sameSite=none cookie in production', () => {
		vi.stubEnv('NODE_ENV', 'production');
		const { res, response } = mockResponse();

		setRefreshTokenCookie(response, 'token');
		const result = res.cookie.mock.calls[0];
		const expected = [
			'refreshToken',
			'token',
			{ httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 },
		];

		expect(result).toEqual(expected);
	});

	it('clears the cookie with the same options', () => {
		vi.stubEnv('NODE_ENV', 'production');
		const { res, response } = mockResponse();

		clearRefreshTokenCookie(response);
		const result = res.clearCookie.mock.calls[0];
		const expected = [
			'refreshToken',
			{ httpOnly: true, secure: true, sameSite: 'none', path: '/', maxAge: 7 * 24 * 60 * 60 * 1000 },
		];

		expect(result).toEqual(expected);
	});
});
