import ForumModel from '../models/forumModel.ts';
import type { ForumPost } from '@beatriz/shared/forums';

export const getAllPosts = async (): Promise<ForumPost[]> => {
	return ForumModel.find().select('-__v');
};

export const getPostsByEvent = async (eventId: string): Promise<ForumPost[]> => {
	return ForumModel.find({ event: eventId }).populate('user').select('-__v').sort({ date: 1 });
};

export const addPost = async (userId: string, eventId: string, message: string): Promise<ForumPost> => {
	return ForumModel.create({ user: userId, event: eventId, message, date: Date.now() });
};
