import type { Forum } from '../models/forumModel.ts';
import type { ForumPostDto } from '../types/forums.ts';

export const toForumDto = (forum: Forum): ForumPostDto => ({
	_id: forum._id,
	date: forum.date,
	user: forum.user,
	event: forum.event,
	message: forum.message,
});
