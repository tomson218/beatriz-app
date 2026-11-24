import type { ItemResponse, ListResponse } from '#types/common';
import type { Event } from '#types/events';
import type { User } from '#types/users';
import type { Types, InferSchemaType } from 'mongoose';
import type { forumSchema } from '#schemas/forumSchema';

/** `user` and `event` are virtual fields: they only have a value after `populate`. */
export type Post = InferSchemaType<typeof forumSchema> & { _id: Types.ObjectId; user?: User; event?: Event };

export interface PostDto extends Omit<Post, '_id'> {
	_id: string;
}

export type GetAllPostsResponse = ListResponse<'posts', PostDto>;

export type PostRequest = Pick<Post, 'message'> & {
	eventId: string;
};

export type AddNewPostToForumRequest = PostRequest;

export type AddNewPostToForumResponse = ItemResponse<'post', PostDto>;

export interface ForumMessageParams {
	message: string;
}
