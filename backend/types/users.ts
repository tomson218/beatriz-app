import type { User } from '../models/userModel.ts';
import type { DiscountCodeDto } from './discountCodes.ts';
import type { EventDto } from './events.ts';
import type { ForumPostDto } from './forums.ts';
import type { OrderDto } from './orders.ts';
import type { TicketDto } from './tickets.ts';

export type UserDto = Pick<
	User,
	| '_id'
	| 'username'
	| 'firstName'
	| 'lastName'
	| 'email'
	| 'photo'
	| 'favouriteEvents'
	| 'cart'
	| 'appliedDiscountCodes'
> & { role: string };

export type DataMap = {
	users: UserDto[];
	tickets: TicketDto[];
	orders: OrderDto[];
	discountCodes: DiscountCodeDto[];
	posts: ForumPostDto[];
	events: EventDto[];

	user: UserDto;
	accessToken: string;
	ticket: TicketDto;
	discountCode: DiscountCodeDto;
	event: EventDto;
	post: ForumPostDto;
	order: OrderDto;
	file: any;
};

export type SuccessList<K extends keyof DataMap> = {
	status: 'success';
	data: {
		results: number;
	} & {
		[P in K]: DataMap[P];
	};
};

export type SuccessItem<K extends keyof DataMap> = {
	status: 'success';
	data: {
		[P in K]: DataMap[P];
	};
};

export type ErrorResponse = { status: 'error' | 'fail'; message: string };

export type GetAllUsersResponse = SuccessList<'users'> | ErrorResponse;

export type GetUserResponse = SuccessItem<'user'> | ErrorResponse;

type CreateUserRequest = {};

type CreateUserResponse = {};

type DeleteUserRequest = {};

type DeleteUserResponse = {};
