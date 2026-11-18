import type { NextFunction, Request, Response } from 'express';
import { toUserDto } from './users.mapper.ts';
import { toEventDto } from '../events/events.mapper.ts';
import {
	addFavouriteEvent,
	deactivateAccount,
	deleteUserById,
	findAllUsers,
	findFavouriteEvents,
	findUserById,
	removeFavouriteEvent,
	saveCart,
	updateOwnProfile,
	updateUserByAdmin,
} from './users.service.ts';
import type { AddCartRequest, UpdateMeRequest, UpdateUserRequest, UserDto, UserIdParams } from '@beatriz/shared/users';
import type { Event, EventDto, EventIdParams } from '@beatriz/shared/events';
import type { UserDocument } from './users.type.ts';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const users: UserDocument[] = await findAllUsers();
		const usersDto: UserDto[] = users.map(toUserDto);

		res.status(200).json({
			status: 'success',
			data: { results: usersDto.length, users: usersDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req: Request<UserIdParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const user: UserDocument = await findUserById(req.params.id);
		const userDto: UserDto = toUserDto(user);

		res.status(200).json({
			status: 'success',
			data: { user: userDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const user: UserDocument = await findUserById(String(req.user._id));
		const userDto: UserDto = toUserDto(user);

		res.status(200).json({
			status: 'success',
			data: { user: userDto },
		});
	} catch (error) {
		next(error);
	}
};

export const updateMe = async (
	req: Request<{}, unknown, UpdateMeRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const user: UserDocument = await updateOwnProfile(String(req.user._id), req.body);
		const userDto: UserDto = toUserDto(user);

		res.status(200).json({
			status: 'success',
			data: { user: userDto },
		});
	} catch (error) {
		next(error);
	}
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await deactivateAccount(String(req.user._id));

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

export const getUserFavoriteEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const events: Event[] = await findFavouriteEvents(String(req.user._id));
		const eventsDto: EventDto[] = events.map(toEventDto);

		res.status(200).json({
			status: 'success',
			data: { results: eventsDto.length, events: eventsDto },
		});
	} catch (error) {
		next(error);
	}
};

export const addEventToFavourite = async (
	req: Request<{}, unknown, EventIdParams>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		await addFavouriteEvent(String(req.user._id), req.body.eventId);

		res.status(201).json({ status: 'success', message: 'Wydarzenie dodane do ulubionych' });
	} catch (error) {
		next(error);
	}
};

export const removeEventFromFavourite = async (req: Request<EventIdParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		await removeFavouriteEvent(String(req.user._id), req.params.eventId);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

export const replaceCart = async (
	req: Request<{}, unknown, AddCartRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const userId: string = String(req.user._id);
		const { cart } = req.body;

		await saveCart(userId, cart);

		res.status(200).json({ status: 'success', data: { cart, userId } });
	} catch (error) {
		next(error);
	}
};

export const updateUser = async (
	req: Request<UserIdParams, unknown, UpdateUserRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;
		const user: UserDocument = await updateUserByAdmin(id, req.body);
		const userDto: UserDto = toUserDto(user);

		res.status(200).json({
			status: 'success',
			data: { user: userDto },
			message: `User ${id} updated!`,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteUser = async (req: Request<UserIdParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		await deleteUserById(req.params.id);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};
