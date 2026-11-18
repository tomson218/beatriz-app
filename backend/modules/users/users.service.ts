import mongoose from 'mongoose';
import UserModel from './users.model.ts';
import type { Event } from '@beatriz/shared/events';
import type { Cart, UpdateMeRequest, UpdateUserRequest } from '@beatriz/shared/users';
import type { UserDocument } from './users.type.ts';

const requireUser = <T>(user: T | null, message = 'No user found with that ID'): T => {
	if (!user) {
		throw Object.assign(new Error(message), { statusCode: 404 });
	}

	return user;
};

export const findAllUsers = async (): Promise<UserDocument[]> => {
	return UserModel.find();
};

export const findUserById = async (id: string): Promise<UserDocument> => {
	return requireUser(await UserModel.findById(id));
};

/** Aktualizuje profil zalogowanego użytkownika: tylko jawnie wymienione pola (bez hasła i roli). */
export const updateOwnProfile = async (userId: string, changes: UpdateMeRequest): Promise<UserDocument> => {
	const { username, email, firstName, lastName } = changes;
	const user: UserDocument | null = await UserModel.findByIdAndUpdate(
		userId,
		{ username, email, firstName, lastName },
		{ new: true, runValidators: true },
	);

	return requireUser(user);
};

/** Edycja użytkownika przez administratora: tylko jawnie wymienione pola (bez haseł i danych technicznych). */
export const updateUserByAdmin = async (id: string, changes: UpdateUserRequest): Promise<UserDocument> => {
	const { username, email, firstName, lastName, role } = changes;
	const user: UserDocument | null = await UserModel.findByIdAndUpdate(
		id,
		{ username, email, firstName, lastName, role },
		{ new: true, runValidators: true },
	);

	return requireUser(user);
};

export const deactivateAccount = async (userId: string): Promise<void> => {
	await UserModel.findByIdAndUpdate(userId, { active: false });
};

export const deleteUserById = async (id: string): Promise<void> => {
	requireUser(await UserModel.findByIdAndDelete(id));
};

export const findFavouriteEvents = async (userId: string): Promise<Event[]> => {
	const user = requireUser(
		await UserModel.findById(userId).populate<{ favouriteEvents: Event[] }>('favouriteEvents').exec(),
		'User not found.',
	);

	return user.favouriteEvents;
};

export const addFavouriteEvent = async (userId: string, eventId: string): Promise<void> => {
	const user: UserDocument = requireUser(await UserModel.findById(userId), 'User not found.');

	const isAlreadyFavourite: boolean = user.favouriteEventIds.some(favouriteId => favouriteId.toString() === eventId);

	if (isAlreadyFavourite) {
		throw Object.assign(new Error('This event is on your list of favourites.'), { statusCode: 409 });
	}

	user.favouriteEventIds.push(new mongoose.Types.ObjectId(eventId));
	await user.save({ validateBeforeSave: false });
};

export const removeFavouriteEvent = async (userId: string, eventId: string): Promise<void> => {
	const user: UserDocument = requireUser(await UserModel.findById(userId), 'User not found.');

	const favouriteIndex: number = user.favouriteEventIds.findIndex(favouriteId => favouriteId.toString() === eventId);

	if (favouriteIndex === -1) {
		throw Object.assign(new Error('This event is not on your list of favourites.'), { statusCode: 404 });
	}

	user.favouriteEventIds.splice(favouriteIndex, 1);
	await user.save({ validateBeforeSave: false });
};

/** Zapisuje koszyk wysłany przez klienta. Uwaga: to NIE jest koszyk zatwierdzony do płatności (patrz moduł `payments`). */
export const saveCart = async (userId: string, cart: Cart): Promise<void> => {
	await UserModel.findByIdAndUpdate(userId, { cart }, { new: true, runValidators: true });
};
