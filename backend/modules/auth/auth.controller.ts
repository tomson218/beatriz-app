import type { NextFunction, Request, Response } from 'express';
import { toUserDto } from '../users/users.mapper.ts';
import { clearRefreshTokenCookie, createSendToken, getRefreshTokenFromRequest } from '../../utils/authTokens.ts';
import {
	authenticateUser,
	getUserFromRefreshToken,
	loginWithFacebook,
	loginWithGoogle,
	registerUser,
	sendWelcomeEmail,
} from './auth.service.ts';
import type {
	AuthUserRequest,
	FacebookLoginRequest,
	GoogleLoginRequest,
	LoginRequest,
} from './auth.type.ts';

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
		const user = await registerUser(req.body);

		createSendToken(toUserDto(user), 201, res);

		// Odpowiedź 201 już poszła, więc błąd wysyłki powitalnego maila możemy tylko zalogować.
		await sendWelcomeEmail(user).catch(error => console.error('Welcome email could not be sent:', error));
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
		const user = await authenticateUser(req.body.email, req.body.password);

		createSendToken(toUserDto(user), 200, res);
	} catch (error) {
		next(error);
	}
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const user = await getUserFromRefreshToken(getRefreshTokenFromRequest(req));

		createSendToken(toUserDto(user), 200, res);
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
		const { user, isNewUser } = await loginWithGoogle(req.body.authCode);
		const statusCode = isNewUser ? 201 : 200;

		createSendToken(toUserDto(user), statusCode, res);
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
		const { user, isNewUser } = await loginWithFacebook(tokens, userProfile);
		const statusCode = isNewUser ? 201 : 200;

		createSendToken(toUserDto(user), statusCode, res);
	} catch (error) {
		next(error);
	}
};
