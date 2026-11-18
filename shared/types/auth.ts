import type { User, UserDto, UserPassword, UserRole } from '#types/users';
import type { ApiResponse } from '#types/common';

export type { MessageResponse } from '#types/common';

export interface AuthUser {
	_id: string;
	email: string;
	role: UserRole;
}

/** Odpowiedź logowania, rejestracji, resetu i zmiany hasła: `{ status, data: { accessToken, user } }`. */
export type AuthResponse = ApiResponse<{
	accessToken: string;
	user: UserDto;
}>;

export type RefreshTokenResponse = AuthResponse;

export type AuthUserRequest = Pick<User, 'username' | 'firstName' | 'lastName' | 'email' | 'password'> & {
	passwordConfirm: UserPassword;
};

export type SignUpInputs = AuthUserRequest & { validate: () => void };

export interface ChangePasswordInputs {
	passwordCurrent: UserPassword;
	password: UserPassword;
	passwordConfirm: UserPassword;
}

export interface ResetPasswordInputs {
	password: UserPassword;
	passwordConfirm: UserPassword;
}
export type LoginUserRequest = Pick<User, 'email' | 'password'>;

export type LoginRequest = LoginUserRequest;

export type ForgetPasswordUserRequest = Pick<User, 'email'>;

export type ForgetPasswordRequest = ForgetPasswordUserRequest;

export interface ResetPasswordParams {
	token: string;
}

/** Body żądania resetu hasła (token jest w ścieżce, patrz `ResetPasswordParams`). */
export type ResetPasswordRequest = ResetPasswordInputs;

/** Body żądania zmiany hasła zalogowanego użytkownika. */
export type UpdatePasswordRequest = ChangePasswordInputs;

export interface GoogleLoginRequest {
	authCode: string;
	clientId: string;
	selectBy: string;
}

// `type` zamiast `interface`: tylko aliasy typów mają niejawną sygnaturę indeksu, więc pasują do `Record<string, unknown>`
// w `FacebookLoginData` (SDK Facebooka zwraca obiekty z dodatkowymi polami).
export type FacebookTokens = {
	accessToken: string;
	userID: string;
	data_access_expiration_time?: number;
};

export type FacebookUserProfile = {
	id: string;
	name: string;
	email: string;
	picture: { data: { url: string } };
};

export interface FacebookLoginRequest {
	tokens: FacebookTokens;
	userProfile: FacebookUserProfile;
}

/**
 * Stan formularza logowania przez Facebooka: dane z SDK uzupełniają się etapami (najpierw tokeny, potem profil),
 * a pola SDK są opcjonalne. Kompletność sprawdza `isFacebookDataReady`, która zawęża typ do `FacebookLoginRequest`.
 */
export interface FacebookLoginData {
	tokens: (Partial<FacebookTokens> & Record<string, unknown>) | null;
	userProfile: (Partial<FacebookUserProfile> & Record<string, unknown>) | null;
}
