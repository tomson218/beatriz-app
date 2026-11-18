import mongoose from 'mongoose';
import UserModel from './users.model.ts';
import { pickFields } from '../../utils/pickFields.ts';
import type { Cart, UpdateMeRequest, UpdateUserRequest, User } from './users.type.ts';

const OWN_PROFILE_FIELDS = ['username', 'email', 'lastName', 'firstName'];
const ADMIN_EDITABLE_FIELDS = [...OWN_PROFILE_FIELDS, 'role'];

const requireUser = (user: User | null, message = 'No user found with that ID'): User => {
	if (!user) {
		throw Object.assign(new Error(message), { statusCode: 404 });
	}

	return user;
};

export const getAllUsers = async (): Promise<User[]> => {
	return UserModel.find().select('-__v');
};

export const getUserById = async (id: string): Promise<User> => {
	return requireUser(await UserModel.findById(id).select('-__v'));
};

/** Aktualizuje profil zalogowanego użytkownika: tylko pola z allowlisty (bez hasła i roli). */
export const updateOwnProfile = async (userId: string, changes: UpdateMeRequest & Record<string, unknown>): Promise<User> => {
	const allowedChanges = pickFields(changes, ...OWN_PROFILE_FIELDS);
	const user = await UserModel.findByIdAndUpdate(userId, allowedChanges, { new: true, runValidators: true });

	return requireUser(user);
};

/** Edycja użytkownika przez administratora: tylko pola z allowlisty (bez haseł i danych technicznych). */
export const updateUserByAdmin = async (id: string, changes: UpdateUserRequest): Promise<User> => {
	const allowedChanges = pickFields(changes as Record<string, unknown>, ...ADMIN_EDITABLE_FIELDS);
	const user = await UserModel.findByIdAndUpdate(id, allowedChanges, { new: true, runValidators: true });

	return requireUser(user);
};

export const deactivateAccount = async (userId: string): Promise<void> => {
	await UserModel.findByIdAndUpdate(userId, { active: false });
};

export const deleteUserById = async (id: string): Promise<void> => {
	requireUser(await UserModel.findByIdAndDelete(id));
};

export const getFavouriteEvents = async (userId: string): Promise<NonNullable<User['favouriteEvents']>> => {
	const user = requireUser(await UserModel.findById(userId).populate('favouriteEvents').exec(), 'User not found.');

	return user.favouriteEvents ?? [];
};

export const addFavouriteEvent = async (userId: string, eventId: string): Promise<void> => {
	const user = requireUser(await UserModel.findById(userId), 'User not found.');

	const isAlreadyFavourite = user.favouriteEventIds.some(favouriteId => favouriteId.toString() === eventId);

	if (isAlreadyFavourite) {
		throw Object.assign(new Error('This event is on your list of favourites.'), { statusCode: 409 });
	}

	user.favouriteEventIds.push(new mongoose.Types.ObjectId(eventId));
	await user.save({ validateBeforeSave: false });
};

export const removeFavouriteEvent = async (userId: string, eventId: string): Promise<void> => {
	const user = requireUser(await UserModel.findById(userId), 'User not found.');

	const favouriteIndex = user.favouriteEventIds.findIndex(favouriteId => favouriteId.toString() === eventId.toString());
	const isNotFavourite = favouriteIndex === -1;

	if (isNotFavourite) {
		throw Object.assign(new Error('This event is not on your list of favourites.'), { statusCode: 404 });
	}

	user.favouriteEventIds.splice(favouriteIndex, 1);
	await user.save({ validateBeforeSave: false });
};

/** Zapisuje koszyk wysłany przez klienta. Uwaga: to NIE jest koszyk zatwierdzony do płatności (patrz `paymentService`). */
export const saveCart = async (userId: string, cart: Cart): Promise<void> => {
	await UserModel.findByIdAndUpdate(userId, { cart }, { new: true, runValidators: true });
};
