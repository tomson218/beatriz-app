import type { ForumPost, ForumPostDto } from '@beatriz/shared/forums';

export const toForumDto = (forum: ForumPost): ForumPostDto => ({
	_id: forum._id,
	date: forum.date,
	user: forum.user,
	event: forum.event,
	message: forum.message,
});
