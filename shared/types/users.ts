import type { Event, EventIdParams } from '@/events';
import type { ErrorResponse, SuccessItem, SuccessList } from '@/common';

export type UserRole = 'user' | 'worker' | 'admin';

export type UserPassword = string;

/** @TODO: Replace `unknown[]` with a proper cart item type (e.g., `OrderTicket[]`) once the cart structure is finalized. */
export type Cart = unknown[];

export interface User {
	_id: string;
	username?: string;
	firstName?: string;
	lastName?: string;
	email: string;
	googleId?: string;
	facebookData?: Record<string, unknown>;
	photo: string;
	role: UserRole;
	favouriteEvents: Event["_id"][];
	password?: UserPassword;
	passwordConfirm?: UserPassword;
	passwordChangedAt?: Date;
	passwordResetToken?: string;
	passwordResetExpires?: Date;
	active: boolean;
	cart: Cart;
	myCart: Cart;
	appliedDiscountCodes: AppliedDiscountCode[];
	createdAt?: string;
	updatedAt?: string;
}

export interface AppliedDiscountCode {
	isUsed?: boolean;
	code?: string;
}

export interface UserDto extends Omit<User, 'password' | 'passwordConfirm' | 'passwordResetToken' | 'passwordResetExpires' | 'myCart'> {
	_id: string;
}

export interface UpdateUserFields {
	username?: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	photo?: string;
}

export type UpdateMeRequest = Pick<UpdateUserFields, 'username' | 'firstName' | 'lastName' | 'email'>;

export interface UpdateUserRequest extends UpdateMeRequest {
	role?: UserRole;
}

export interface UserIdParams {
	userId: User["_id"];
}

export type FavouriteEventRequest = EventIdParams;

export interface AddCartRequest {
	items: unknown[];
}

export interface DataMap {
	[key: string]: unknown;
}

export type UserCartSuccess = SuccessList<unknown>;

export interface UserMessageSuccess {
	message: string;
}

export type GetAllUsersResponse = SuccessList<UserDto>;

export type GetUserResponse = SuccessItem<UserDto>;

export type GetUserFavoriteEventsResponse = SuccessList<unknown>;

export interface DeleteUserResponse {
	message: string;
}

export type AddCartResponse = SuccessList<unknown>;
