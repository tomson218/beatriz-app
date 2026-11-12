import type { UserDto } from '../types/users.ts';

export const toUserDto = (user: any): UserDto => ({
	_id: user._id.toString(),
	username: user.username,
	email: user.email,
	createdAt: user.createdAt,
});
