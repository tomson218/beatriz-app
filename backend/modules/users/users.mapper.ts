import type { UserDto } from '@beatriz/shared/users';
import type { UserDocument } from './users.type.ts';

export const toUserDto = (user: UserDocument): UserDto => ({
	_id: user._id.toString(),
	username: user.username,
	email: user.email,
	firstName: user.firstName,
	lastName: user.lastName,
	photo: user.photo,
	favouriteEventIds: user.favouriteEventIds,
	cart: user.cart,
	appliedDiscountCodes: user.appliedDiscountCodes,
	role: user.role,
});
