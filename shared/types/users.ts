import type { ApiResponse, ItemResponse, ListResponse, MessageResponse } from '#types/common';
import type { Types, InferSchemaType } from 'mongoose';
import type { userSchema } from '#schemas/userSchema';
import type { Event } from '#types/events';
import type { USER_ROLES } from '#enums/userRoles';

/** `favouriteEvents` to pole wirtualne: ma wartość tylko po `populate`. */
export type User = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId; favouriteEvents?: Event[] };
export type UserRole = (typeof USER_ROLES)[number];

export type UserPassword = User['password'];

/** @TODO: Replace `unknown[]` with a proper cart item type (e.g., `OrderTicket[]`) once the cart structure is finalized. */
export type Cart = unknown[];

export interface AppliedDiscountCode {
	isUsed?: boolean;
	code?: string;
}

export type UserDto = Pick<
	User,
	| 'username'
	| 'email'
	| 'firstName'
	| 'lastName'
	| 'photo'
	| 'favouriteEventIds'
	| 'cart'
	| 'appliedDiscountCodes'
	| 'role'
> & {
	_id: string;
};

export type UserRequest = Pick<User, 'username' | 'firstName' | 'lastName' | 'email' | 'photo'>;

export type UpdateMeRequest = Pick<UserRequest, 'username' | 'firstName' | 'lastName' | 'email'>;

export interface UpdateUserRequest extends UpdateMeRequest {
	role?: UserRole;
}

export interface UserIdParams {
	id: string;
}

export interface AddCartRequest {
	cart: Cart;
}

export type AddCartResponse = ApiResponse<{
	cart: Cart;
	userId: string;
}>;

export interface DataMap {
	[key: string]: unknown;
}

export interface UserMessageSuccess {
	message: string;
}

export type GetAllUsersResponse = ListResponse<'users', UserDto>;

export type GetUserResponse = ItemResponse<'user', UserDto>;

/** Ulubione wydarzenia: `{ status, data: { results, events } }`. */
export type FavouriteEventsResponse = ListResponse<'events', Event>;

/** Dodanie ulubionego: `{ status, message }`. */
export type FavouriteEventResponse = MessageResponse;

/** Usunięcie użytkownika kończy się statusem 204 (bez treści). */
export type DeleteUserResponse = Partial<MessageResponse>;
