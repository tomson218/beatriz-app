import type { AuthUserRequest } from '@beatriz/shared/auth';
import type { UserDocument } from '../users/users.type.ts';

/** Dane z tokenu Google, których używamy do założenia lub powiązania konta. */
export interface GoogleTokenPayload {
	email: string;
	sub: string;
}

/** Dane profilu Facebooka zapisywane przy koncie. */
export interface FacebookData {
	id: string;
	picture: string;
	firstName: string;
	lastName: string;
}

/** Wynik logowania przez dostawcę zewnętrznego: konto i informacja, czy dopiero je założono. */
export interface SocialLoginResult {
	user: UserDocument;
	isNewUser: boolean;
}

export type SignupInput = Pick<AuthUserRequest, 'username' | 'firstName' | 'lastName' | 'email' | 'password' | 'passwordConfirm'>;
