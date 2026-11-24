import type { PostDto } from '@beatriz/shared/forums';
import type { PostDocument } from './posts.type.ts';

export const toPostDto = (post: PostDocument): PostDto => ({
	_id: post._id.toString(),
	date: post.date,
	userId: post.userId,
	user: post.get('user'),
	eventId: post.eventId,
	event: post.get('event'),
	message: post.message,
});
