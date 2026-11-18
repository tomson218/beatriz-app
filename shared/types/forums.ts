import type { ItemResponse, ListResponse } from '#types/common';
import type { Event } from '#types/events';
import type { Types, InferSchemaType } from 'mongoose';
import type { forumSchema } from '#schemas/forumSchema';

export type ForumPost = InferSchemaType<typeof forumSchema> & { _id: Types.ObjectId };

export interface ForumPostDto extends Omit<ForumPost, '_id'> {
	_id: string;
}

export type GetAllForumPostsResponse = ListResponse<'posts', ForumPostDto>;

export type ForumPostRequest = Pick<ForumPost, 'message'> & {
	eventId: Event["_id"];
};

export type AddNewPostToForumRequest = ForumPostRequest;

export type AddNewPostToForumResponse = ItemResponse<'post', ForumPostDto>;

export interface ForumMessageParams {
	message: string;
}
