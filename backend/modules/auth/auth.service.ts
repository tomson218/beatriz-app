import { jwtDecode } from 'jwt-decode';
import UserModel from '../users/users.model.ts';
import { sendEmail } from '../../utils/email.ts';
import { verifyRefreshToken } from '../../utils/authTokens.ts';
import { verifyFacebookToken } from '../../utils/facebookAuth.ts';
import type { User } from '../users/users.type.ts';
import type {
	FacebookData,
	FacebookTokens,
	FacebookUserProfile,
	GoogleTokenPayload,
	SignupInput,
	SocialLoginResult,
} from './auth.type.ts';

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
		throw Object.assign(new Error('Please provide email and password!'), { statusCode: 400 });
	}

	const user: User | null = await UserModel.findOne({ email }).select('+password');
	const isPasswordCorrect = user ? await user.correctPassword(password, user.password) : false;

	if (!user || !isPasswordCorrect) {
		throw Object.assign(new Error('Incorrect email or password'), { statusCode: 401 });
	}

	return user;
};

/** Zwraca użytkownika, do którego należy poprawny refresh token; w przeciwnym razie rzuca 401. */
export const getUserFromRefreshToken = async (refreshToken: string | undefined): Promise<User> => {
	if (!refreshToken) {
		throw Object.assign(new Error('Refresh token is missing.'), { statusCode: 401 });
	}

	const decodedToken = await verifyRefreshToken(refreshToken).catch(() => {
		throw Object.assign(new Error('Invalid or expired refresh token.'), { statusCode: 401 });
	});

	const user: User | null = await UserModel.findById(decodedToken.id);

	if (!user) {
		throw Object.assign(new Error('User not found for refresh token.'), { statusCode: 401 });
	}

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
		throw Object.assign(new Error('Token is not valid'), { statusCode: 401 });
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
