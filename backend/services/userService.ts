import mongoose from 'mongoose';
import UserModel from '../models/userModel.ts';
import AppError from '../utils/appError.ts';
import { pickFields } from '../utils/pickFields.ts';
import type { Cart, UpdateMeRequest, UpdateUserRequest, User } from '@beatriz/shared/users';

const OWN_PROFILE_FIELDS = ['username', 'email', 'lastName', 'firstName'];
const ADMIN_EDITABLE_FIELDS = [...OWN_PROFILE_FIELDS, 'role'];

const requireUser = (user: User | null, message = 'No user found with that ID'): User => {
	if (!user) {
		throw new AppError(message, 404);
	}

	return user;
};

export const getAllUsers = async (): Promise<User[]> => {
	return UserModel.find().select('-__v');
};

export const getUserById = async (id: string): Promise<User> => {
	return requireUser(await UserModel.findById(id).select('-__v'));
};

/** Aktualizuje profil zalogowanego użytkownika. Zmiana hasła ma osobny endpoint, a rola nie jest edytowalna. */
export const updateOwnProfile = async (userId: string, changes: UpdateMeRequest & Record<string, unknown>): Promise<User> => {
	const isPasswordChange = Boolean(changes.password || changes.passwordConfirm);

	if (isPasswordChange) {
		throw new AppError("This route isn't for password updates. Please use /updateMyPassword", 400);
	}

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

export const getFavouriteEvents = async (userId: string): Promise<User['favouriteEvents']> => {
	const user = requireUser(await UserModel.findById(userId).populate('favouriteEvents').exec(), 'User not found.');

	return user.favouriteEvents;
};

export const addFavouriteEvent = async (userId: string, eventId: string): Promise<void> => {
	const user = requireUser(await UserModel.findById(userId), 'User not found.');

	const isAlreadyFavourite = user.favouriteEvents.some(favourite => favourite.toString() === eventId);

	if (isAlreadyFavourite) {
		throw new AppError('This event is on your list of favourites.', 409);
	}

	user.favouriteEvents.push(new mongoose.Types.ObjectId(eventId));
	await user.save({ validateBeforeSave: false });
};

export const removeFavouriteEvent = async (userId: string, eventId: string): Promise<void> => {
	const user = requireUser(await UserModel.findById(userId), 'User not found.');

	const favouriteIndex = user.favouriteEvents.findIndex(favourite => favourite.toString() === eventId.toString());
	const isNotFavourite = favouriteIndex === -1;

	if (isNotFavourite) {
		throw new AppError('This event is not on your list of favourites.', 404);
	}

	user.favouriteEvents.splice(favouriteIndex, 1);
	await user.save({ validateBeforeSave: false });
};

/** Zapisuje koszyk wysłany przez klienta. Uwaga: to NIE jest koszyk zatwierdzony do płatności (patrz `paymentService`). */
export const saveCart = async (userId: string, cart: Cart): Promise<void> => {
	await UserModel.findByIdAndUpdate(userId, { cart }, { new: true, runValidators: true });
};
