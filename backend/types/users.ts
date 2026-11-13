import type { User } from '../models/userModel.ts';
import type { Event } from '../models/eventModel.ts';
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

export type UpdateUserFields = Partial<Pick<UserDto, 'username' | 'firstName' | 'lastName' | 'email' | 'photo'>>;
export type UpdateMeRequest = UpdateUserFields;
export type UpdateUserRequest = UpdateUserFields;
export type UserIdParams = { id: User['_id'] };
export type FavouriteEventRequest = { eventId: Event['_id'] };
export type AddCartRequest = { cart: User['cart'] };

export type DataMap = {
	users: UserDto[];
	tickets: TicketDto[];
	orders: OrderDto[];
	discountCodes: DiscountCodeDto[];
	posts: ForumPostDto[];
	events: EventDto[];
	cart: User['cart'];
	userId: User['_id'];

	user: UserDto;
	updatedUser: UserDto;
	accessToken: string;
	ticket: TicketDto;
	discountCode: DiscountCodeDto;
	event: EventDto;
	post: ForumPostDto;
	order: OrderDto;
	file: { filename?: string };
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

export type UserCartSuccess = SuccessItem<'cart'>;
export type UserMessageSuccess = { status: 'success'; message: string };

export type GetAllUsersResponse = SuccessList<'users'> | ErrorResponse;
export type GetUserResponse = SuccessItem<'user'> | ErrorResponse;
export type UpdateMeResponse = SuccessItem<'updatedUser'> | ErrorResponse;
export type GetUserFavoriteEventsResponse = SuccessList<'events'> | ErrorResponse;
export type UpdateUserResponse = SuccessItem<'user'> | ErrorResponse;
export type DeleteUserResponse = { status: 'success'; data?: null } | ErrorResponse;
export type AddCartResponse = UserCartSuccess | ErrorResponse;
