import type { User, UserPassword, UserRole } from '@/types/users';
import type { SuccessItem, SuccessList } from '@/types/common';

export interface AuthUser {
	_id: string;
	email: string;
	role: UserRole;
}

export interface AuthResponse {
	token: string;
	user: AuthUser;
}

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

export interface MessageResponse {
	message: string;
}

export interface ResetPasswordParams {
	token: string;
}

export type ResetPasswordUserRequest = {
	token: string;
	password: UserPassword;
};

export type ResetPasswordRequest = ResetPasswordUserRequest;

export interface RefreshTokenResponse {
	token: string;
}

export type UpdatePasswordUserRequest = {
	oldPassword: UserPassword;
	newPassword: UserPassword;
};

export type UpdatePasswordRequest = UpdatePasswordUserRequest;

export interface GoogleLoginRequest {
	authCode: string;
	clientId: string;
	selectBy: string;
}

export interface FacebookLoginRequest {
	tokens: unknown;
	userProfile: unknown;
}

export interface FacebookLoginData {
	tokens: unknown | null;
	userProfile: unknown | null;
}

