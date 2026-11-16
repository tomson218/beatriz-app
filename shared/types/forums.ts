import type { SuccessItem, SuccessList } from '@/common';
import type { Event } from '@/events';
import type { User } from '@/users';

export interface ForumPost {
	_id: string;
	date: string | Date;
	user: User | User["_id"];
	event: Event | Event["_id"];
	message: string;
	createdAt?: string;
	updatedAt?: string;
}

export interface ForumPostDto extends Omit<ForumPost, '_id'> {
	_id: string;
}

export type GetAllForumPostsResponse = SuccessList<ForumPostDto>;

export type GetPostsByEventIdResponse = GetAllForumPostsResponse;

export interface AddNewPostToForumRequest {
	message: string;
	eventId: Event["_id"];
}

export type AddNewPostToForumResponse = SuccessItem<ForumPostDto>;


export interface ForumMessageParams {
	message: string;
}
