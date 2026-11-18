import ForumModel from './posts.model.ts';
import type { PostDocument } from './posts.type.ts';

export const findAllPosts = async (): Promise<PostDocument[]> => {
	return ForumModel.find().select('-__v');
};

export const findPostsByEvent = async (eventId: string): Promise<PostDocument[]> => {
	return ForumModel.find({ eventId }).populate('user', 'username email photo').select('-__v').sort({ date: 1 });
};

export const addPost = async (userId: string, eventId: string, message: string): Promise<PostDocument> => {
	return ForumModel.create({ userId, eventId, message, date: Date.now() });
};
