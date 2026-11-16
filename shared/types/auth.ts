import type { User, UserPassword } from '@/users';
import type { SuccessItem, SuccessList } from '@/common';

export interface AuthResponse {
	token: string;
	user: {
		_id: string;
		email: string;
		role: string;
	};
}

export type AuthSuccessResponse = AuthResponse;
export type SignUpResponse = AuthResponse;
export type LoginResponse = AuthResponse;
export type GoogleLoginResponse = AuthResponse;
export type FacebookLoginResponse = AuthResponse;

export type AuthSuccessList = SuccessList<AuthResponse>;
export type AuthSuccessItem = SuccessItem<AuthResponse>;

export interface SignUpRequest {
	username: string;
	firstName: string;
	lastName: string;
	email: string;
	password: UserPassword;
	passwordConfirm: UserPassword;
}

export type SignUpInputs = SignUpRequest & { validate: () => void };

export interface ChangePasswordInputs {
	passwordCurrent: UserPassword;
	password: UserPassword;
	passwordConfirm: UserPassword;
}

export interface ResetPasswordInputs {
	password: UserPassword;
	passwordConfirm: UserPassword;
}
export interface LoginRequest {
	email: string;
	password: string;
}

export interface ForgetPasswordRequest {
	email: User["email"];
}

export interface MessageResponse {
	message: string;
}

export type ForgetPasswordResponse = MessageResponse;

export interface ResetPasswordParams {
	token: string;
}

export interface ResetPasswordRequest {
	token: string;
	password: string;
}

export type ResetPasswordResponse = MessageResponse;

export interface RefreshTokenResponse {
	token: string;
}

export type LogoutResponse = MessageResponse;

export interface UpdatePasswordRequest {
	oldPassword: UserPassword;
	newPassword: UserPassword;
}

export type UpdatePasswordResponse = MessageResponse;

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

