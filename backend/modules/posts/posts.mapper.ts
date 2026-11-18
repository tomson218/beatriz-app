import type { ForumPost, ForumPostDto } from './posts.type.ts';

export const toForumDto = (forum: ForumPost): ForumPostDto => ({
	_id: forum._id,
	date: forum.date,
	userId: forum.userId,
	user: forum.user,
	eventId: forum.eventId,
	event: forum.event,
	message: forum.message,
});
