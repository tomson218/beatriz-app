import type { NextFunction, Request, Response } from 'express';
import { toUserDto } from './users.mapper.ts';
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
} from './users.service.ts';
import type { AddCartRequest, UpdateMeRequest, UpdateUserRequest, UserIdParams } from './users.type.ts';
import type { EventIdParams } from '../events/events.type.ts';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const users = await findAllUsers();

		res.status(200).json({
			status: 'success',
			data: { results: users.length, users: users.map(toUserDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const getUser = async (req: Request<UserIdParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const user = await getUserById(req.params.id);

		res.status(200).json({
			status: 'success',
			data: { user: toUserDto(user) },
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
		const user = await updateOwnProfile(req.user.id, req.body);

		res.status(200).json({
			status: 'success',
			data: { user: toUserDto(user) },
		});
	} catch (error) {
		next(error);
	}
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		await deactivateAccount(req.user.id);

		res.status(204).send();
	} catch (error) {
		next(error);
	}
};

export const getUserFavoriteEvents = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const events = await getFavouriteEvents(req.user.id);

		res.status(200).json({
			status: 'success',
			data: { results: events.length, events },
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
		await addFavouriteEvent(req.user.id, req.body.eventId);

		res.status(201).json({ status: 'success', message: 'Wydarzenie dodane do ulubionych' });
	} catch (error) {
		next(error);
	}
};

export const removeEventFromFavourite = async (req: Request<EventIdParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		await removeFavouriteEvent(req.user.id, req.params.eventId);

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
		const userId = String(req.user.id);
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
		const user = await updateUserByAdmin(id, req.body);

		res.status(200).json({
			status: 'success',
			data: { user: toUserDto(user) },
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
