import type { NextFunction, Request, Response } from 'express';
import { toUserDto } from '../users/users.mapper.ts';
import {
	clearRefreshTokenCookie,
	createAuthTokens,
	getRefreshTokenFromRequest,
	setRefreshTokenCookie,
	type AuthTokens,
} from '../../utils/authTokens.ts';
import {
	authenticateUser,
	getUserFromRefreshToken,
	loginWithFacebook,
	loginWithGoogle,
	registerUser,
	sendWelcomeEmail,
} from './auth.service.ts';
import type { AuthUserRequest, FacebookLoginRequest, GoogleLoginRequest, LoginRequest } from '@beatriz/shared/auth';
import type { UserDto } from '@beatriz/shared/users';
import type { UserDocument } from '../users/users.type.ts';
import type { SocialLoginResult } from './auth.type.ts';

export const logout = (req: Request, res: Response, next: NextFunction): void => {
	try {
		clearRefreshTokenCookie(res);

		res.status(200).json({ status: 'success', data: null });
	} catch (error) {
		next(error);
	}
};

export const signup = async (
	req: Request<{}, unknown, AuthUserRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const user: UserDocument = await registerUser(req.body);
		const userDto: UserDto = toUserDto(user);
		const { accessToken, refreshToken }: AuthTokens = createAuthTokens(userDto._id);

		setRefreshTokenCookie(res, refreshToken);
		res.status(201).json({ status: 'success', data: { accessToken, user: userDto } });

		// Odpowiedź 201 już poszła, więc błąd wysyłki powitalnego maila możemy tylko zalogować.
		await sendWelcomeEmail(user).catch((error: unknown) => console.error('Welcome email could not be sent:', error));
	} catch (error) {
		next(error);
	}
};

export const login = async (
	req: Request<{}, unknown, LoginRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const user: UserDocument = await authenticateUser(req.body.email, req.body.password);
		const userDto: UserDto = toUserDto(user);
		const { accessToken, refreshToken }: AuthTokens = createAuthTokens(userDto._id);

		setRefreshTokenCookie(res, refreshToken);
		res.status(200).json({ status: 'success', data: { accessToken, user: userDto } });
	} catch (error) {
		next(error);
	}
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const user: UserDocument = await getUserFromRefreshToken(getRefreshTokenFromRequest(req));
		const userDto: UserDto = toUserDto(user);
		const { accessToken, refreshToken }: AuthTokens = createAuthTokens(userDto._id);

		setRefreshTokenCookie(res, refreshToken);
		res.status(200).json({ status: 'success', data: { accessToken, user: userDto } });
	} catch (error) {
		next(error);
	}
};

export const googleLogin = async (
	req: Request<{}, unknown, GoogleLoginRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { user, isNewUser }: SocialLoginResult = await loginWithGoogle(req.body.authCode);
		const userDto: UserDto = toUserDto(user);
		const { accessToken, refreshToken }: AuthTokens = createAuthTokens(userDto._id);

		setRefreshTokenCookie(res, refreshToken);
		res.status(isNewUser ? 201 : 200).json({ status: 'success', data: { accessToken, user: userDto } });
	} catch (error) {
		next(error);
	}
};

export const facebookLogin = async (
	req: Request<{}, unknown, FacebookLoginRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { tokens, userProfile } = req.body;
		const { user, isNewUser }: SocialLoginResult = await loginWithFacebook(tokens, userProfile);
		const userDto: UserDto = toUserDto(user);
		const { accessToken, refreshToken }: AuthTokens = createAuthTokens(userDto._id);

		setRefreshTokenCookie(res, refreshToken);
		res.status(isNewUser ? 201 : 200).json({ status: 'success', data: { accessToken, user: userDto } });
	} catch (error) {
		next(error);
	}
};
