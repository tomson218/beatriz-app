import ForumModel, { type Forum } from '../models/forumModel.ts';
import { type Request, type Response, type NextFunction } from 'express';
import type { ForumPostDto } from '../types/forums.ts';
import { toForumDto } from '../mappers/forumMapper.ts';

export const getAllForumPosts = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const forumPosts: Forum[] = await ForumModel.find().select('-__v');

		const forumPostsDto: ForumPostDto[] = forumPosts.map((f: Forum) => toForumDto(f));

		res.status(200).json({
			status: 'success',
			results: forumPostsDto.length,
			forumPosts: forumPostsDto,
		});
	} catch (err) {
		next(err);
	}
};

export const getPostsByEventId = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { eventId } = req.params;

		const forumPosts: Forum[] = await ForumModel.find({ event: eventId })
			.populate('user')
			.select('-__v')
			.sort({ date: 1 });

		const forumPostsDto: ForumPostDto[] = forumPosts.map((f: Forum) => toForumDto(f));

		res.status(200).json({
			status: 'success',
			results: forumPostsDto.length,
			forumPosts: forumPostsDto,
		});
	} catch (err) {
		next(err);
	}
};

export const addNewPostToForum = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const userId: string = req.user.id;

		const { message, eventId } = req.body;

		const newPost: Forum = await ForumModel.create({
			user: userId,
			message: message,
			event: eventId,
			date: Date.now(),
		});

		const newPostDto: ForumPostDto = toForumDto(newPost);

		res.status(200).json({
			status: 'success',
			newPost: newPostDto,
		});
	} catch (err) {
		next(err);
	}
};
