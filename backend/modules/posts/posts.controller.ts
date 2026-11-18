import type { NextFunction, Request, Response } from 'express';
import { toForumDto } from './posts.mapper.ts';
import { addPost, getAllPosts, getPostsByEvent } from './posts.service.ts';
import type { ForumMessageParams, PostsByEventParams } from './posts.type.ts';

export const getAllForumPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const posts = await getAllPosts();

		res.status(200).json({
			status: 'success',
			data: { results: posts.length, posts: posts.map(toForumDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const getPostsByEventId = async (req: Request<PostsByEventParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const posts = await getPostsByEvent(req.params.eventId);

		res.status(200).json({
			status: 'success',
			data: { results: posts.length, posts: posts.map(toForumDto) },
		});
	} catch (error) {
		next(error);
	}
};

export const addNewPostToForum = async (
	req: Request<PostsByEventParams, unknown, ForumMessageParams>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const post = await addPost(req.user.id, req.params.eventId, req.body.message);

		res.status(201).json({
			status: 'success',
			data: { post: toForumDto(post) },
		});
	} catch (error) {
		next(error);
	}
};
