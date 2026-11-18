import type { NextFunction, Request, Response } from 'express';
import { toForumDto } from './posts.mapper.ts';
import { addPost, findAllPosts, findPostsByEvent } from './posts.service.ts';
import type { ForumMessageParams, ForumPostDto } from '@beatriz/shared/forums';
import type { PostDocument, PostsByEventParams } from './posts.type.ts';

export const getAllForumPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const posts: PostDocument[] = await findAllPosts();
		const postsDto: ForumPostDto[] = posts.map(toForumDto);

		res.status(200).json({
			status: 'success',
			data: { results: postsDto.length, posts: postsDto },
		});
	} catch (error) {
		next(error);
	}
};

export const getPostsByEventId = async (req: Request<PostsByEventParams>, res: Response, next: NextFunction): Promise<void> => {
	try {
		const posts: PostDocument[] = await findPostsByEvent(req.params.eventId);
		const postsDto: ForumPostDto[] = posts.map(toForumDto);

		res.status(200).json({
			status: 'success',
			data: { results: postsDto.length, posts: postsDto },
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
		const post: PostDocument = await addPost(String(req.user._id), req.params.eventId, req.body.message);
		const postDto: ForumPostDto = toForumDto(post);

		res.status(201).json({
			status: 'success',
			data: { post: postDto },
		});
	} catch (error) {
		next(error);
	}
};
