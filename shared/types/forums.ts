import type { ItemResponse, ListResponse } from '#types/common';
import type { Event } from '#types/events';
import type { User } from '#types/users';
import type { Types, InferSchemaType } from 'mongoose';
import type { forumSchema } from '#schemas/forumSchema';

/** `user` i `event` to pola wirtualne: mają wartość tylko po `populate`. */
export type ForumPost = InferSchemaType<typeof forumSchema> & { _id: Types.ObjectId; user?: User; event?: Event };

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
