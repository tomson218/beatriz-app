import type { SuccessItem, SuccessList } from '@/types/common';
import { Types, type InferSchemaType } from 'mongoose';
import { userSchema } from '@/schemas/userSchema';
import type { Event } from '@/types/events';
import { USER_ROLES } from '@/enums/userRoles';

export type User = InferSchemaType<typeof userSchema> & { _id: Types.ObjectId };
export type UserRole = (typeof USER_ROLES)[number];

export type UserPassword = User['password'];

/** @TODO: Replace `unknown[]` with a proper cart item type (e.g., `OrderTicket[]`) once the cart structure is finalized. */
export type Cart = unknown[];

export interface AppliedDiscountCode {
	isUsed?: boolean;
	code?: string;
}

export interface UserDto extends Omit<User, 'password' | 'passwordConfirm' | 'passwordResetToken' | 'passwordResetExpires' | 'myCart'> {
	_id: string;
}

export type UserRequest = Pick<User, 'username' | 'firstName' | 'lastName' | 'email' | 'photo'>;

export type UpdateMeRequest = Pick<UserRequest, 'username' | 'firstName' | 'lastName' | 'email'>;

export interface UpdateUserRequest extends UpdateMeRequest {
	role?: UserRole;
}

export interface UserIdParams {
	userId: User["_id"];
}

export interface AddCartRequest {
	items: unknown[];
}

export interface DataMap {
	[key: string]: unknown;
}

export interface UserMessageSuccess {
	message: string;
}

export type GetAllUsersResponse = SuccessList<UserDto>;

export type GetUserResponse = SuccessItem<UserDto>;

export interface DeleteUserResponse {
	message: string;
}

