import { jwtDecode } from 'jwt-decode';
import UserModel from '../users/users.model.ts';
import { sendEmail } from '../../utils/email.ts';
import { verifyRefreshToken } from '../../utils/authTokens.ts';
import { verifyFacebookToken } from '../../utils/facebookAuth.ts';
import type { FacebookTokens, FacebookUserProfile } from '@beatriz/shared/auth';
import type { UserDocument } from '../users/users.type.ts';
import type { FacebookData, GoogleTokenPayload, SignupInput, SocialLoginResult } from './auth.type.ts';

const buildWelcomeMessage = (firstName: string): string =>
	`Cześć ${firstName}!\n\nTwoje konto na Beatriz App jest już gotowe, a teraz przed Tobą otwierają się drzwi do koncertów, festiwali, spektakli i wielu innych wyjątkowych wydarzeń. Sprawdź, co już teraz jest w ofercie – może znajdziesz coś, co Cię zainspiruje!\n\nDo zobaczenia na widowni!\n\nZespół Beatriz App`;

const buildFacebookData = (profile: FacebookUserProfile): FacebookData => {
	const [firstName, lastName] = profile.name.split(' ');

	return { id: profile.id, picture: profile.picture.data.url, firstName, lastName };
};

/**
 * Zakłada konto. Pola przekazujemy jawnie (allowlista): rola jest ustawiana wyłącznie po stronie serwera,
 * więc nie można jej podać w żądaniu.
 */
export const registerUser = async ({
	username,
	firstName,
	lastName,
	email,
	password,
	passwordConfirm,
}: SignupInput): Promise<UserDocument> => {
	return UserModel.create({ username, firstName, lastName, email, password, passwordConfirm });
};

export const sendWelcomeEmail = async (user: UserDocument): Promise<void> => {
	await sendEmail({
		email: user.email,
		subject: 'Witamy w Beatriz App',
		message: buildWelcomeMessage(user.firstName ?? ''),
	});
};

/** Sprawdza e-mail i hasło; przy błędzie rzuca 400 (brak danych) albo 401 (złe dane). */
export const authenticateUser = async (email: string, password?: string | null): Promise<UserDocument> => {
	if (!email || !password) {
		throw Object.assign(new Error('Please provide email and password!'), { statusCode: 400 });
	}

	const user = (await UserModel.findOne({ email }).select('+password')) as UserDocument | null;
	const isPasswordCorrect: boolean = user?.password ? await user.correctPassword(password, user.password) : false;

	if (!user || !isPasswordCorrect) {
		throw Object.assign(new Error('Incorrect email or password'), { statusCode: 401 });
	}

	return user;
};

/** Zwraca użytkownika, do którego należy poprawny refresh token; w przeciwnym razie rzuca 401. */
export const getUserFromRefreshToken = async (refreshToken: string | undefined): Promise<UserDocument> => {
	if (!refreshToken) {
		throw Object.assign(new Error('Refresh token is missing.'), { statusCode: 401 });
	}

	let userId: string;

	try {
		userId = verifyRefreshToken(refreshToken).id;
	} catch {
		throw Object.assign(new Error('Invalid or expired refresh token.'), { statusCode: 401 });
	}

	const user: UserDocument | null = await UserModel.findById(userId);

	if (!user) {
		throw Object.assign(new Error('User not found for refresh token.'), { statusCode: 401 });
	}

	return user;
};

export const loginWithGoogle = async (authCode: string): Promise<SocialLoginResult> => {
	const { email, sub: googleId }: GoogleTokenPayload = jwtDecode<GoogleTokenPayload>(authCode);

	const existingUser: UserDocument | null = await UserModel.findOne({ email });

	if (!existingUser) {
		const user: UserDocument = await UserModel.create({ email, googleId });

		return { user, isNewUser: true };
	}

	if (!existingUser.googleId) {
		existingUser.googleId = googleId;
		await existingUser.save();
	}

	return { user: existingUser, isNewUser: false };
};

export const loginWithFacebook = async (tokens: FacebookTokens, profile: FacebookUserProfile): Promise<SocialLoginResult> => {
	const isTokenValid: boolean = await verifyFacebookToken(tokens);

	if (!isTokenValid) {
		throw Object.assign(new Error('Token is not valid'), { statusCode: 401 });
	}

	const facebookData: FacebookData = buildFacebookData(profile);
	const existingUser: UserDocument | null = await UserModel.findOne({ email: profile.email });

	if (!existingUser) {
		const user: UserDocument = await UserModel.create({ email: profile.email, facebookData });

		return { user, isNewUser: true };
	}

	if (!existingUser.facebookData) {
		existingUser.facebookData = facebookData;
		await existingUser.save();
	}

	return { user: existingUser, isNewUser: false };
};
