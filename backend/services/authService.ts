import crypto from 'crypto';
import { jwtDecode } from 'jwt-decode';
import UserModel from '../models/userModel.ts';
import AppError from '../utils/appError.ts';
import { sendEmail } from '../utils/email.ts';
import { verifyRefreshToken } from '../utils/authTokens.ts';
import { verifyFacebookToken } from '../utils/facebookAuth.ts';
import type { User } from '@beatriz/shared/users';
import type { AuthUserRequest, FacebookTokens, FacebookUserProfile } from '@beatriz/shared/auth';

/** Dane z tokenu Google, których używamy do założenia lub powiązania konta. */
interface GoogleTokenPayload {
	email: string;
	sub: string;
}

/** Dane profilu Facebooka zapisywane przy koncie. */
interface FacebookData {
	id: string;
	picture: string;
	firstName: string;
	lastName: string;
}

/** Wynik logowania przez dostawcę zewnętrznego: konto i informacja, czy dopiero je założono. */
interface SocialLoginResult {
	user: User;
	isNewUser: boolean;
}

type SignupInput = Pick<AuthUserRequest, 'username' | 'firstName' | 'lastName' | 'email' | 'password' | 'passwordConfirm'>;

const buildWelcomeMessage = (firstName: string): string =>
	`Cześć ${firstName}!\n\nTwoje konto na Beatriz App jest już gotowe, a teraz przed Tobą otwierają się drzwi do koncertów, festiwali, spektakli i wielu innych wyjątkowych wydarzeń. Sprawdź, co już teraz jest w ofercie – może znajdziesz coś, co Cię zainspiruje!\n\nDo zobaczenia na widowni!\n\nZespół Beatriz App`;

const buildFacebookData = (profile: FacebookUserProfile): FacebookData => {
	const [firstName, lastName] = profile.name.split(' ');

	return { id: profile.id, picture: profile.picture.data.url, firstName, lastName };
};

/**
 * Zakłada konto. Pola przekazujemy jawnie (allowlista): rola i `passwordChangedAt`
 * są ustawiane wyłącznie po stronie serwera, więc nie można ich podać w żądaniu.
 */
export const registerUser = async ({
	username,
	firstName,
	lastName,
	email,
	password,
	passwordConfirm,
}: SignupInput): Promise<User> => {
	return UserModel.create({ username, firstName, lastName, email, password, passwordConfirm });
};

export const sendWelcomeEmail = async (user: User): Promise<void> => {
	await sendEmail({
		email: user.email,
		subject: 'Witamy w Beatriz App',
		message: buildWelcomeMessage(user.firstName),
	});
};

/** Sprawdza e-mail i hasło; przy błędzie rzuca 400 (brak danych) albo 401 (złe dane). */
export const authenticateUser = async (email: string, password: string): Promise<User> => {
	const hasNoCredentials = !email || !password;

	if (hasNoCredentials) {
		throw new AppError('Please provide email and password!', 400);
	}

	const user: User | null = await UserModel.findOne({ email }).select('+password');
	const isPasswordCorrect = user ? await user.correctPassword(password, user.password) : false;

	if (!user || !isPasswordCorrect) {
		throw new AppError('Incorrect email or password', 401);
	}

	return user;
};

/** Generuje token resetu hasła i wysyła go e-mailem. Gdy wysyłka się nie uda, token jest unieważniany. */
export const requestPasswordReset = async (email: string): Promise<void> => {
	const user: User | null = await UserModel.findOne({ email });

	if (!user) {
		throw new AppError('There is no user with that email address.', 404);
	}

	const resetToken = user.createPasswordResetToken();
	await user.save({ validateBeforeSave: false });

	const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
	const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

	try {
		await sendEmail({ email: user.email, subject: 'Your password reset token (valid for 10 min)', message });
	} catch (error) {
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save({ validateBeforeSave: false });

		throw error;
	}
};

export const resetPasswordWithToken = async (token: string, password: string, passwordConfirm: string): Promise<User> => {
	const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

	const user: User | null = await UserModel.findOne({
		passwordResetToken: hashedToken,
		passwordResetExpires: { $gt: Date.now() },
	});

	if (!user) {
		throw new AppError('Token is invalid or has expired', 400);
	}

	user.password = password;
	user.passwordConfirm = passwordConfirm;
	user.passwordResetToken = undefined;
	user.passwordResetExpires = undefined;
	await user.save();

	return user;
};

/** Zwraca użytkownika, do którego należy poprawny refresh token; w przeciwnym razie rzuca 401. */
export const getUserFromRefreshToken = async (refreshToken: string | undefined): Promise<User> => {
	if (!refreshToken) {
		throw new AppError('Refresh token is missing.', 401);
	}

	const decodedToken = await verifyRefreshToken(refreshToken).catch(() => {
		throw new AppError('Invalid or expired refresh token.', 401);
	});

	const user: User | null = await UserModel.findById(decodedToken.id);

	if (!user) {
		throw new AppError('User not found for refresh token.', 401);
	}

	return user;
};

export const changePassword = async (
	userId: string,
	currentPassword: string,
	password: string,
	passwordConfirm: string,
): Promise<User> => {
	const user: User | null = await UserModel.findById(userId).select('+password');
	const isCurrentPasswordCorrect = user ? await user.correctPassword(currentPassword, user.password) : false;

	if (!user || !isCurrentPasswordCorrect) {
		throw new AppError('Your current password is wrong', 401);
	}

	user.password = password;
	user.passwordConfirm = passwordConfirm;
	await user.save();

	return user;
};

export const loginWithGoogle = async (authCode: string): Promise<SocialLoginResult> => {
	const { email, sub: googleId } = jwtDecode<GoogleTokenPayload>(authCode);

	const existingUser: User | null = await UserModel.findOne({ email });

	if (!existingUser) {
		const user: User = await UserModel.create({ email, googleId });

		return { user, isNewUser: true };
	}

	if (!existingUser.googleId) {
		existingUser.googleId = googleId;
		await existingUser.save();
	}

	return { user: existingUser, isNewUser: false };
};

export const loginWithFacebook = async (tokens: FacebookTokens, profile: FacebookUserProfile): Promise<SocialLoginResult> => {
	const isTokenValid = await verifyFacebookToken(tokens);

	if (!isTokenValid) {
		throw new AppError('Token is not valid', 401);
	}

	const facebookData = buildFacebookData(profile);
	const existingUser: User | null = await UserModel.findOne({ email: profile.email });

	if (!existingUser) {
		const user: User = await UserModel.create({ email: profile.email, facebookData });

		return { user, isNewUser: true };
	}

	if (!existingUser.facebookData) {
		existingUser.facebookData = facebookData;
		await existingUser.save();
	}

	return { user: existingUser, isNewUser: false };
};
