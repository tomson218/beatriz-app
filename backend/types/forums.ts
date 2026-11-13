import type { Forum } from '../models/forumModel.ts';
import type { Event } from '../models/eventModel.ts';
import type { SuccessList, SuccessItem, ErrorResponse } from './users.ts';

export type ForumPostDto = Pick<Forum, '_id' | 'date' | 'user' | 'event' | 'message'>;

export type GetAllForumPostsResponse = SuccessList<'posts'> | ErrorResponse;

export type AddNewPostToForumRequest = Pick<ForumPostDto, 'message'> & { eventId: Event['_id'] };

export type AddNewPostToForumResponse = SuccessItem<'post'> | ErrorResponse;

export type GetPostsByEventIdResponse = GetAllForumPostsResponse;
