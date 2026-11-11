import UserModel from '../models/userModel.ts';
import AppError from '../utils/appError.ts';
import mongoose from 'mongoose';
import { type Request, type Response, type NextFunction } from 'express';

const { ObjectId } = mongoose.Types;

const filterObj = (obj: any, ...allowedFields: any) => {
	const newObj = {};
	Object.keys(obj).forEach(item => {
		if (allowedFields.includes(item)) {
			newObj[item] = obj[item];
		}
	});
	return newObj;
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await UserModel.find().select('-__v');

		res.status(200).json({
			status: 'success',
			results: users.length,
			users,
		});
	} catch (err) {
		next(err);
	}
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const user = await UserModel.findById(id).select('-__v');

		res.status(200).json({
			status: 'success',
			user,
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};

export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (req.body.password || req.body.passwordConfirm) {
			return next(new AppError("This route isn't for password updates. Please use /updateMyPassword", 400));
		}

		const filteredBody = filterObj(req.body, 'username', 'email', 'lastName', 'firstName');

		const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, filteredBody, {
			new: true,
			runValidators: true,
		});

		res.status(200).json({
			status: 'success',
			updatedUser,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction) => {
	try {
		await UserModel.findByIdAndUpdate(req.user.id, { active: false });

		res.status(204).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		next(err);
	}
};

export const getUserFavoriteEvents = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.findById(req.user.id).populate('favouriteEvents').exec();

		if (!user) {
			return next(new AppError('This event is not on your list of favourites.', 404));
		}

		const { favouriteEvents } = user;

		res.status(200).json({
			status: 'success',
			favouriteEvents,
		});
	} catch (err) {
		next(err);
	}
};

export const addEventToFavourite = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { eventId } = req.body;

		const user = await UserModel.findById(req.user.id);

		const isExistEvent = e => e.toString() === eventId;

		if (user.favouriteEvents.findIndex(isExistEvent) !== -1) {
			return next(new AppError('This event is on your list of favourites.', 409));
		}

		const eventObjectId = new ObjectId(eventId);

		user.favouriteEvents.push(eventObjectId);

		await user.save({ validateBeforeSave: false });

		res.status(200).json({ message: 'Wydarzenie dodane do ulubionych' });
	} catch (err) {
		next(err);
	}
};

export const removeEventFromFavourite = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { eventId } = req.body;

		const user = await UserModel.findById(req.user.id);

		const isExistEvent = e => e.toString() === eventId.toString();

		const searchIndex = user.favouriteEvents.findIndex(isExistEvent);

		if (searchIndex === -1) {
			return next(new AppError('This event is not on your list of favourites.', 404));
		}

		user.favouriteEvents.splice(searchIndex, 1);

		await user.save({ validateBeforeSave: false });

		res.status(200).json({ message: 'Wydarzenie usuniete z ulubionych' });
	} catch (err) {
		next(err);
	}
};

export const addCart = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.user.id;

	const { cart } = req.body;

	const user = await UserModel.findByIdAndUpdate(userId, { cart }, { new: true, runValidators: true });

	res.status(200).json({
		cart,
		userId,
		status: 'error',
		message: 'This route is not yet defined!',
	});
};

export const createUser = (req: Request, res: Response) => {
	res.status(500).json({
		status: 'error',
		message: 'This route is not yet defined!',
	});
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		console.log('ID:', id);
		console.log('Request body:', req.body);

		const updatedUser = await UserModel.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

		res.status(200).json({
			status: 'success',
			message: `User ${id} updated!`,
			updatedUser,
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Error updating user',
		});
	}
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const user = await UserModel.findById(id);

		console.log(user);

		await UserModel.findByIdAndDelete(id);

		res.status(204).json({
			status: 'success',
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Error deleting user',
		});
	}
};
