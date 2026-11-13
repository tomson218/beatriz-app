import UserModel, { type User } from '../models/userModel.ts';
import AppError from '../utils/appError.ts';
import mongoose from 'mongoose';
import { type Request, type Response, type NextFunction } from 'express';
import type { UserDto } from '../types/users.ts';
import { toUserDto } from '../mappers/userMapper.ts';
import type {
	GetUserResponse,
	GetAllUsersResponse,
	UpdateMeResponse,
	GetUserFavoriteEventsResponse,
	UpdateUserResponse,
	DeleteUserResponse,
	AddCartResponse,
	UpdateMeRequest,
	UpdateUserRequest,
	UserIdParams,
	FavouriteEventRequest,
	AddCartRequest,
} from '../types/users.ts';

const { ObjectId } = mongoose.Types;

/* to do innego pliku */
const filterObj = (obj: any, ...allowedFields: any): any => {
	const newObj = {};
	Object.keys(obj).forEach(item => {
		if (allowedFields.includes(item)) {
			newObj[item] = obj[item];
		}
	});
	return newObj;
};

export const getAllUsers = async (
	req: Request,
	res: Response<GetAllUsersResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const users: User[] = await UserModel.find().select('-__v');

		const usersDto: UserDto[] = users.map((u: User) => toUserDto(u));

		res.status(200).json({
			status: 'success',
			data: {
				results: usersDto.length,
				users: usersDto,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const getUser = async (
	req: Request<UserIdParams>,
	res: Response<GetUserResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;

		const user: User | null = await UserModel.findById(id).select('-__v'); // do poprawy

		const userDto: UserDto = toUserDto(user);

		res.status(200).json({
			status: 'success',
			data: {
				user: userDto,
			},
		});
	} catch (err) {
		console.error(err);
		res.status(500).json({
			status: 'error',
			message: 'Something went wrong',
		});
	}
};

export const updateMe = async (req: Request, res: Response<UpdateMeResponse>, next: NextFunction): Promise<void> => {
	try {
		if (req.body.password || req.body.passwordConfirm) {
			return next(new AppError("This route isn't for password updates. Please use /updateMyPassword", 400));
		}

		const filteredBody = filterObj(req.body, 'username', 'email', 'lastName', 'firstName');

		const updatedUser = await UserModel.findByIdAndUpdate(req.user.id, filteredBody, {
			// do poprawy
			new: true,
			runValidators: true,
		});

		const updatedUserDto: UserDto = toUserDto(updatedUser);

		res.status(200).json({
			status: 'success',
			data: {
				user: updatedUserDto,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const deleteMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const getUserFavoriteEvents = async (
	req: Request,
	res: Response<GetUserFavoriteEventsResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const user = await UserModel.findById(req.user.id).populate('favouriteEvents').exec(); // do poprawy

		if (!user) {
			return next(new AppError('This event is not on your list of favourites.', 404));
		}

		const { favouriteEvents } = user;

		res.status(200).json({
			status: 'success',
			data: {
				results: favouriteEvents.length,
				events: favouriteEvents,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const addEventToFavourite = async (
	req: Request<{}, {}, FavouriteEventRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { eventId } = req.body;

		const user: User | null = await UserModel.findById(req.user.id); // do poprawy

		const isExistEvent = (e: any) => e.toString() === eventId;

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

export const removeEventFromFavourite = async (
	req: Request<{}, {}, FavouriteEventRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const { eventId } = req.body;

		const user: User | null = await UserModel.findById(req.user.id);

		const isExistEvent = (e: any) => e.toString() === eventId.toString();

		const searchIndex = user.favouriteEvents.findIndex(isExistEvent);

		if (searchIndex === -1) {
			return next(new AppError('This event is not on your list of favourites.', 404));
		}

		user.favouriteEvents.splice(searchIndex, 1);

		await user.save({ validateBeforeSave: false });

		res.status(200).json({ status: 'success', message: 'Wydarzenie usuniete z ulubionych' });
	} catch (err) {
		next(err);
	}
};

export const addCart = async (
	req: Request<{}, {}, AddCartRequest>,
	res: Response<AddCartResponse>,
	next: NextFunction,
): Promise<void> => {
	const userId: User['_id'] = req.user.id; // do poprawy

	const { cart } = req.body;

	const user: User | null = await UserModel.findByIdAndUpdate(userId, { cart }, { new: true, runValidators: true });

	res.status(200).json({
		data: {
			cart, // jaki ma to kształt tak w ogóle
			userId,
		},
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

export const updateUser = async (
	req: Request<UserIdParams, {}, UpdateUserRequest>,
	res: Response<UpdateUserResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;

		const updatedUser: User | null = await UserModel.findByIdAndUpdate(id, req.body, {
			new: true,
			runValidators: true,
		});

		const updatedUserDto: UserDto = toUserDto(updatedUser);

		res.status(200).json({
			status: 'success',
			message: `User ${id} updated!`,
			data: {
				updatedUser: updatedUserDto,
			},
		});
	} catch (err) {
		res.status(500).json({
			status: 'error',
			message: 'Error updating user',
		});
	}
};

export const deleteUser = async (
	req: Request<UserIdParams>,
	res: Response<DeleteUserResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const { id } = req.params;

		const user: User | null = await UserModel.findById(id);

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
