import ForumModel from '../models/forumModel.ts';
import type { ForumPost } from '@beatriz/shared/forums';
import { type Request, type Response, type NextFunction } from 'express';
import type {
	AddNewPostToForumResponse,
	ForumPostDto,
	GetAllForumPostsResponse,
} from '@beatriz/shared/forums';
import { toForumDto } from '../mappers/forumMapper.ts';
import type { User } from '@beatriz/shared/users';

export const getAllForumPosts = async (
	req: Request,
	res: Response<GetAllForumPostsResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const forumPosts: ForumPost[] = await ForumModel.find().select('-__v');

		const forumPostsDto: ForumPostDto[] = forumPosts.map(f => toForumDto(f));

		res.status(200).json({
			status: 'success',
			data: {
				results: forumPostsDto.length,
				posts: forumPostsDto,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const getPostsByEventId = async (
	req: Request<{ eventId: Event['_id'] }>,
	res: Response<GetAllForumPostsResponse>,
	next: NextFunction,
): Promise<void> => {
	try {
		const { eventId } = req.params;

		const forumPosts: ForumPost[] = await ForumModel.find({ event: eventId })
			.populate('user')
			.select('-__v')
			.sort({ date: 1 });

		const forumPostsDto: ForumPostDto[] = forumPosts.map(f => toForumDto(f));

		res.status(200).json({
			status: 'success',
			data: {
				results: forumPostsDto.length,
				posts: forumPostsDto,
			},
		});
	} catch (err) {
		next(err);
	}
};

export const addNewPostToForum = async (req: Request, res: Response<AddNewPostToForumResponse>, next: NextFunction) => {
	try {
		const userId: User['_id'] = req.user.id;

		const { message, eventId } = req.body;

		const newPost: ForumPost = await ForumModel.create({
			user: userId,
			message: message,
			event: eventId,
			date: Date.now(),
		});

		const newPostDto: ForumPostDto = toForumDto(newPost);

		res.status(200).json({
			status: 'success',
			data: {
				post: newPostDto,
			},
		});
	} catch (err) {
		next(err);
	}
};
