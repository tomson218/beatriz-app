import { catchAsync } from '../utils/catchAsync.ts';
import { toUserDto } from '../mappers/userMapper.ts';
import { clearRefreshTokenCookie, createSendToken, getRefreshTokenFromRequest } from '../utils/authTokens.ts';
import {
	authenticateUser,
	changePassword,
	getUserFromRefreshToken,
	loginWithFacebook,
	loginWithGoogle,
	registerUser,
	requestPasswordReset,
	resetPasswordWithToken,
	sendWelcomeEmail,
} from '../services/authService.ts';
import type {
	AuthUserRequest,
	FacebookLoginRequest,
	ForgetPasswordRequest,
	GoogleLoginRequest,
	LoginRequest,
	ResetPasswordParams,
	ResetPasswordRequest,
	UpdatePasswordRequest,
} from '@beatriz/shared/auth';

export const logout = catchAsync(async (req, res) => {
	clearRefreshTokenCookie(res);

	res.status(200).json({ status: 'success', data: null });
});

export const signup = catchAsync<{}, AuthUserRequest>(async (req, res) => {
	const user = await registerUser(req.body);

	createSendToken(toUserDto(user), 201, res);

	// Odpowiedź 201 już poszła, więc błąd wysyłki powitalnego maila możemy tylko zalogować.
	await sendWelcomeEmail(user).catch(error => console.error('Welcome email could not be sent:', error));
});

export const login = catchAsync<{}, LoginRequest>(async (req, res) => {
	const user = await authenticateUser(req.body.email, req.body.password);

	createSendToken(toUserDto(user), 200, res);
});

export const forgetPassword = catchAsync<{}, ForgetPasswordRequest>(async (req, res) => {
	await requestPasswordReset(req.body.email);

	res.status(200).json({ status: 'success', message: 'Token sent to email!' });
});

export const resetPassword = catchAsync<ResetPasswordParams, ResetPasswordRequest>(async (req, res) => {
	const { password, passwordConfirm } = req.body;
	const user = await resetPasswordWithToken(req.params.token, password, passwordConfirm);

	createSendToken(toUserDto(user), 200, res);
});

export const refreshAccessToken = catchAsync(async (req, res) => {
	const user = await getUserFromRefreshToken(getRefreshTokenFromRequest(req));

	createSendToken(toUserDto(user), 200, res);
});

export const updatePassword = catchAsync<{}, UpdatePasswordRequest>(async (req, res) => {
	const { passwordCurrent, password, passwordConfirm } = req.body;
	const user = await changePassword(req.user.id, passwordCurrent, password, passwordConfirm);

	createSendToken(toUserDto(user), 200, res);
});

export const googleLogin = catchAsync<{}, GoogleLoginRequest>(async (req, res) => {
	const { user, isNewUser } = await loginWithGoogle(req.body.authCode);
	const statusCode = isNewUser ? 201 : 200;

	createSendToken(toUserDto(user), statusCode, res);
});

export const facebookLogin = catchAsync<{}, FacebookLoginRequest>(async (req, res) => {
	const { tokens, userProfile } = req.body;
	const { user, isNewUser } = await loginWithFacebook(tokens, userProfile);
	const statusCode = isNewUser ? 201 : 200;

	createSendToken(toUserDto(user), statusCode, res);
});
