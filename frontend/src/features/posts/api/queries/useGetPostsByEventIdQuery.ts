import instance from '@/shared/api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import type { EventDto } from '@beatriz/shared/events';
import { queryKeys } from '@/shared/api/queryKeys';
import type { PostDto } from '@beatriz/shared/forums';
import type { UserDto } from '@beatriz/shared/users';

/** A forum post with its author populated by the API (`username`, `email`, `photo`). */
export type PostWithAuthor = Omit<PostDto, 'user'> & { user: Pick<UserDto, '_id' | 'email' | 'photo' | 'username'> };

const useGetPostsByEventIdQuery = (eventId: EventDto['_id']) => {
	const getPostsByEventId = async (): Promise<PostWithAuthor[]> => {
		const response = await instance.get(`/events/${eventId}/posts`);
		return response.data.data.posts;
	};

	return useQuery({
		queryKey: queryKeys.posts.byEvent(eventId),
		queryFn: getPostsByEventId,
	});
};

export default useGetPostsByEventIdQuery;
