import ForumModel from '../models/forumModel.ts';
import { type Request, type Response, type NextFunction } from 'express';

export const getAllForumPosts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const forumPosts = await ForumModel.find().select('-__v');

		res.status(200).json({
			status: 'success',
			results: forumPosts.length,
			forumPosts,
		});
	} catch (err) {
		next(err);
	}
};

export const getPostsByEventId = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { eventId } = req.params;

		const forumPosts = await ForumModel.find({ event: eventId }).populate('user').select('-__v').sort({ date: 1 });

		res.status(200).json({
			status: 'success',
			results: forumPosts.length,
			forumPosts,
		});
	} catch (err) {
		next(err);
	}
};

export const addNewPostToForum = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId: string = req.user.id;

		const { message, eventId } = req.body;

		const newPost = await ForumModel.create({
			user: userId,
			message: message,
			event: eventId,
			date: Date.now(),
		});

		res.status(200).json({
			status: 'success',
			newPost,
		});
	} catch (err) {
		next(err);
	}
};
