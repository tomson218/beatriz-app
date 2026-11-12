import type { UserDto } from '../types/users.ts';

export const toUserDto = (user: any): UserDto => ({
	_id: user._id.toString(),
	username: user.username,
	email: user.email,
	firstName: user.firstName,
	lastName: user.lastName,
	photo: user.photo,
	favouriteEvents: user.favouriteEvents,
	cart: user.cart,
	appliedDiscountCodes: user.appliedDiscountCodes,
	role: user.role,
});
