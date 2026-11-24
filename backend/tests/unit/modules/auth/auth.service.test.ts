import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import jwt from 'jsonwebtoken';
import UserModel from '../../../../modules/users/users.model.ts';
import { sendEmail } from '../../../../utils/email.ts';
import { verifyFacebookToken } from '../../../../utils/facebookAuth.ts';
import { createAuthTokens } from '../../../../utils/authTokens.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { catchAsyncError } from '../../../helpers/catchError.ts';
import {
	authenticateUser,
	getUserFromRefreshToken,
	loginWithFacebook,
	loginWithGoogle,
	registerUser,
	sendWelcomeEmail,
} from '../../../../modules/auth/auth.service.ts';

vi.mock('../../../../modules/users/users.model.ts', () => ({
	default: { create: vi.fn(), findOne: vi.fn(), findById: vi.fn() },
}));
vi.mock('../../../../utils/email.ts', () => ({ sendEmail: vi.fn() }));
vi.mock('../../../../utils/facebookAuth.ts', () => ({ verifyFacebookToken: vi.fn() }));

const User = vi.mocked(UserModel);

interface FakeUser {
	[field: string]: unknown;
	correctPassword: Mock;
	save: Mock;
	googleId?: string;
	facebookData?: unknown;
}

const fakeUser = (overrides: Record<string, unknown> = {}): FakeUser => ({
	_id: 'user-1',
	email: 'jan@example.com',
	firstName: 'Jan',
	password: 'hashed',
	correctPassword: vi.fn(),
	save: vi.fn(),
	...overrides,
});

describe('registerUser', () => {
	it('returns the created user', async () => {
		User.create.mockResolvedValue('created' as never);

		const result = await registerUser({ username: 'jan', email: 'jan@example.com' } as never);
		const expected = 'created';

		expect(result).toBe(expected);
	});

	it('creates the user only from allowed fields (role cannot be injected)', async () => {
		const input = {
			username: 'jan',
			firstName: 'Jan',
			lastName: 'Kowalski',
			email: 'jan@example.com',
			password: 'secret123',
			passwordConfirm: 'secret123',
			role: 'admin',
		};

		await registerUser(input);
		const expected = {
			username: 'jan',
			firstName: 'Jan',
			lastName: 'Kowalski',
			email: 'jan@example.com',
			password: 'secret123',
			passwordConfirm: 'secret123',
		};

		expect(User.create).toHaveBeenCalledWith(expected);
	});
});

describe('sendWelcomeEmail', () => {
	it('sends a welcome email addressed to the user by first name', async () => {
		await sendWelcomeEmail(fakeUser() as never);
		const result = vi.mocked(sendEmail).mock.calls[0][0];
		const expected = {
			email: 'jan@example.com',
			subject: 'Witamy w Beatriz App',
			message: expect.stringMatching(/^Cześć Jan!/),
		};

		expect(result).toEqual(expected);
	});

	it('handles a missing first name', async () => {
		await sendWelcomeEmail(fakeUser({ firstName: undefined }) as never);
		const result = vi.mocked(sendEmail).mock.calls[0][0].message;
		const expected = /^Cześć !/;

		expect(result).toMatch(expected);
	});
});

describe('authenticateUser', () => {
	it.each([
		['', 'pass'],
		['jan@example.com', ''],
		['jan@example.com', undefined],
		['jan@example.com', null],
	])('throws 400 when email (%s) or password (%s) is missing', async (email, password) => {
		const result = await catchAsyncError(authenticateUser(email, password));
		const expected = { statusCode: 400, message: 'Please provide email and password!' };

		expect(result).toMatchObject(expected);
		expect(User.findOne).not.toHaveBeenCalled();
	});

	it('returns the user when the password is correct', async () => {
		const user = fakeUser();
		user.correctPassword.mockResolvedValue(true);
		User.findOne.mockReturnValue(mockQuery(user) as never);

		const result = await authenticateUser('jan@example.com', 'secret');
		const expected = user;

		expect(result).toBe(expected);
	});

	it('looks the user up by email with the password field and compares the password', async () => {
		const user = fakeUser();
		user.correctPassword.mockResolvedValue(true);
		const query = mockQuery(user);
		User.findOne.mockReturnValue(query as never);

		await authenticateUser('jan@example.com', 'secret');
		const expectedFilter = { email: 'jan@example.com' };
		const expectedSelect = '+password';
		const expectedPasswordCheck = ['secret', 'hashed'];

		expect(User.findOne).toHaveBeenCalledWith(expectedFilter);
		expect(query.select).toHaveBeenCalledWith(expectedSelect);
		expect(user.correctPassword).toHaveBeenCalledWith(...expectedPasswordCheck);
	});

	it.each([
		['the password is wrong', () => ({ ...fakeUser(), correctPassword: vi.fn().mockResolvedValue(false) })],
		['the user does not exist', () => null],
		['the account has no password (social login)', () => fakeUser({ password: undefined })],
	])('throws 401 when %s', async (_label, makeUser) => {
		User.findOne.mockReturnValue(mockQuery(makeUser()) as never);

		const result = await catchAsyncError(authenticateUser('jan@example.com', 'secret'));
		const expected = { statusCode: 401, message: 'Incorrect email or password' };

		expect(result).toMatchObject(expected);
	});
});

describe('getUserFromRefreshToken', () => {
	it.each([
		['missing', undefined, 'Refresh token is missing.'],
		['malformed', 'garbage', 'Invalid or expired refresh token.'],
		['signed with another secret', jwt.sign({ id: 'user-1' }, 'other-secret'), 'Invalid or expired refresh token.'],
	])('throws 401 when the token is %s', async (_label, token, message) => {
		const result = await catchAsyncError(getUserFromRefreshToken(token));
		const expected = { statusCode: 401, message };

		expect(result).toMatchObject(expected);
		expect(User.findById).not.toHaveBeenCalled();
	});

	it('throws 401 when the user no longer exists', async () => {
		User.findById.mockResolvedValue(null);

		const result = await catchAsyncError(getUserFromRefreshToken(createAuthTokens('user-1').refreshToken));
		const expected = { statusCode: 401, message: 'User not found for refresh token.' };

		expect(result).toMatchObject(expected);
	});

	it('returns the user the token belongs to', async () => {
		const user = fakeUser();
		User.findById.mockResolvedValue(user as never);

		const result = await getUserFromRefreshToken(createAuthTokens('user-1').refreshToken);
		const expected = user;

		expect(result).toBe(expected);
		expect(User.findById).toHaveBeenCalledWith('user-1');
	});
});

describe('loginWithGoogle', () => {
	const googleCredential = jwt.sign({ email: 'jan@example.com', sub: 'google-123' }, 'any-secret');

	it('creates a new user when no account uses the email', async () => {
		const created = fakeUser();
		User.findOne.mockResolvedValue(null);
		User.create.mockResolvedValue(created as never);

		const result = await loginWithGoogle(googleCredential);
		const expected = { user: created, isNewUser: true };
		const expectedNewUser = { email: 'jan@example.com', googleId: 'google-123' };

		expect(result).toEqual(expected);
		expect(User.create).toHaveBeenCalledWith(expectedNewUser);
	});

	it('links the Google id to an existing account without one', async () => {
		const existing = fakeUser({ googleId: undefined });
		User.findOne.mockResolvedValue(existing as never);

		const result = await loginWithGoogle(googleCredential);
		const expected = { user: existing, isNewUser: false };

		expect(result).toEqual(expected);
		expect(existing.googleId).toBe('google-123');
		expect(existing.save).toHaveBeenCalled();
	});

	it('does not overwrite an existing Google id', async () => {
		const existing = fakeUser({ googleId: 'google-old' });
		User.findOne.mockResolvedValue(existing as never);

		await loginWithGoogle(googleCredential);
		const result = existing.googleId;
		const expected = 'google-old';

		expect(result).toBe(expected);
		expect(existing.save).not.toHaveBeenCalled();
	});

	it('throws for a malformed credential', async () => {
		const result = await catchAsyncError(loginWithGoogle('not-a-jwt'));
		const expected = { name: 'InvalidTokenError' };

		expect(result).toMatchObject(expected);
	});
});

describe('loginWithFacebook', () => {
	const tokens = { accessToken: 'fb', userID: 'fb-1', data_access_expiration_time: 0 } as never;
	const profile = {
		id: 'fb-1',
		email: 'jan@example.com',
		name: 'Jan Kowalski',
		picture: { data: { url: 'https://fb.example/pic.jpg' } },
	} as never;
	const facebookData = { id: 'fb-1', picture: 'https://fb.example/pic.jpg', firstName: 'Jan', lastName: 'Kowalski' };

	beforeEach(() => {
		vi.mocked(verifyFacebookToken).mockResolvedValue(true);
	});

	it('throws 401 when Facebook does not confirm the token', async () => {
		vi.mocked(verifyFacebookToken).mockResolvedValue(false);

		const result = await catchAsyncError(loginWithFacebook(tokens, profile));
		const expected = { statusCode: 401, message: 'Token is not valid' };

		expect(result).toMatchObject(expected);
		expect(User.findOne).not.toHaveBeenCalled();
	});

	it('creates a new user with Facebook profile data', async () => {
		const created = fakeUser();
		User.findOne.mockResolvedValue(null);
		User.create.mockResolvedValue(created as never);

		const result = await loginWithFacebook(tokens, profile);
		const expected = { user: created, isNewUser: true };
		const expectedNewUser = { email: 'jan@example.com', facebookData };

		expect(result).toEqual(expected);
		expect(User.create).toHaveBeenCalledWith(expectedNewUser);
	});

	it('links Facebook data to an existing account without it', async () => {
		const existing = fakeUser({ facebookData: undefined });
		User.findOne.mockResolvedValue(existing as never);

		const result = await loginWithFacebook(tokens, profile);
		const expected = { user: existing, isNewUser: false };

		expect(result).toEqual(expected);
		expect(existing.facebookData).toEqual(facebookData);
		expect(existing.save).toHaveBeenCalled();
	});

	it('keeps existing Facebook data', async () => {
		const existing = fakeUser({ facebookData: { id: 'old' } });
		User.findOne.mockResolvedValue(existing as never);

		await loginWithFacebook(tokens, profile);
		const result = existing.facebookData;
		const expected = { id: 'old' };

		expect(result).toEqual(expected);
		expect(existing.save).not.toHaveBeenCalled();
	});
});
