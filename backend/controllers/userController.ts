import { catchAsync } from '../utils/catchAsync.ts';
import { itemResponse, listResponse } from '../utils/apiResponse.ts';
import { toUserDto } from '../mappers/userMapper.ts';
import {
	addFavouriteEvent,
	deactivateAccount,
	deleteUserById,
	getAllUsers as findAllUsers,
	getFavouriteEvents,
	getUserById,
	removeFavouriteEvent,
	saveCart,
	updateOwnProfile,
	updateUserByAdmin,
} from '../services/userService.ts';
import type { AddCartRequest, UpdateMeRequest, UpdateUserRequest, UserIdParams } from '@beatriz/shared/users';
import type { EventIdParams } from '@beatriz/shared/events';

export const getAllUsers = catchAsync(async (req, res) => {
	const users = await findAllUsers();

	res.status(200).json(listResponse('users', users.map(toUserDto)));
});

export const getUser = catchAsync<UserIdParams>(async (req, res) => {
	const user = await getUserById(req.params.id);

	res.status(200).json(itemResponse('user', toUserDto(user)));
});

export const updateMe = catchAsync<{}, UpdateMeRequest>(async (req, res) => {
	const user = await updateOwnProfile(req.user.id, req.body);

	res.status(200).json(itemResponse('user', toUserDto(user)));
});

export const deleteMe = catchAsync(async (req, res) => {
	await deactivateAccount(req.user.id);

	res.status(204).json({ status: 'success', data: null });
});

export const getUserFavoriteEvents = catchAsync(async (req, res) => {
	const events = await getFavouriteEvents(req.user.id);

	res.status(200).json(listResponse('events', events));
});

export const addEventToFavourite = catchAsync<{}, EventIdParams>(async (req, res) => {
	await addFavouriteEvent(req.user.id, req.body.eventId);

	res.status(200).json({ status: 'success', message: 'Wydarzenie dodane do ulubionych' });
});

export const removeEventFromFavourite = catchAsync<{}, EventIdParams>(async (req, res) => {
	await removeFavouriteEvent(req.user.id, req.body.eventId);

	res.status(200).json({ status: 'success', message: 'Wydarzenie usuniete z ulubionych' });
});

export const addCart = catchAsync<{}, AddCartRequest>(async (req, res) => {
	const userId = String(req.user.id);
	const { cart } = req.body;

	await saveCart(userId, cart);

	res.status(200).json({ status: 'success', data: { cart, userId } });
});

export const createUser = catchAsync(async (req, res) => {
	res.status(500).json({ status: 'error', message: 'This route is not yet defined!' });
});

export const updateUser = catchAsync<UserIdParams, UpdateUserRequest>(async (req, res) => {
	const { id } = req.params;
	const user = await updateUserByAdmin(id, req.body);

	res.status(200).json({ ...itemResponse('user', toUserDto(user)), message: `User ${id} updated!` });
});

export const deleteUser = catchAsync<UserIdParams>(async (req, res) => {
	await deleteUserById(req.params.id);

	res.status(204).json({ status: 'success' });
});
