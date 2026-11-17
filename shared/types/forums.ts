import type { SuccessItem, SuccessList } from '@/types/common';
import type { Event } from '@/types/events';
import type { User } from '@/types/users';
import { Types, type InferSchemaType } from 'mongoose';
import { forumSchema } from '@/schemas/forumSchema';

export type ForumPost = InferSchemaType<typeof forumSchema> & { _id: Types.ObjectId };

export interface ForumPostDto extends Omit<ForumPost, '_id'> {
	_id: string;
}

export type GetAllForumPostsResponse = SuccessList<ForumPostDto>;

export type ForumPostRequest = Pick<ForumPost, 'message'> & {
	eventId: Event["_id"];
};

export type AddNewPostToForumRequest = ForumPostRequest;

export type AddNewPostToForumResponse = SuccessItem<ForumPostDto>;


export interface ForumMessageParams {
	message: string;
}
