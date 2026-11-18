import ForumModel from './posts.model.ts';
import type { ForumPost } from './posts.type.ts';

export const getAllPosts = async (): Promise<ForumPost[]> => {
	return ForumModel.find().select('-__v');
};

export const getPostsByEvent = async (eventId: string): Promise<ForumPost[]> => {
	return ForumModel.find({ eventId }).populate('user').select('-__v').sort({ date: 1 });
};

export const addPost = async (userId: string, eventId: string, message: string): Promise<ForumPost> => {
	return ForumModel.create({ userId, eventId, message, date: Date.now() });
};
