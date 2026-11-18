import { catchAsync } from '../utils/catchAsync.ts';
import { itemResponse, listResponse } from '../utils/apiResponse.ts';
import { toForumDto } from '../mappers/forumMapper.ts';
import { addPost, getAllPosts, getPostsByEvent } from '../services/forumService.ts';
import type { AddNewPostToForumRequest } from '@beatriz/shared/forums';

export const getAllForumPosts = catchAsync(async (req, res) => {
	const posts = await getAllPosts();

	res.status(200).json(listResponse('posts', posts.map(toForumDto)));
});

export const getPostsByEventId = catchAsync<{ eventId: string }>(async (req, res) => {
	const posts = await getPostsByEvent(req.params.eventId);

	res.status(200).json(listResponse('posts', posts.map(toForumDto)));
});

export const addNewPostToForum = catchAsync<{}, AddNewPostToForumRequest>(async (req, res) => {
	const { message, eventId } = req.body;
	const post = await addPost(req.user.id, eventId, message);

	res.status(200).json(itemResponse('post', toForumDto(post)));
});
