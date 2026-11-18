import instance from '@/shared/api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import type { Event } from '@beatriz/shared/events';
import { queryKeys } from '@/shared/api/queryKeys';

const useGetPostsByEventIdQuery = (eventId: Event["_id"]) => {
	const getPostsByEventId = async () => {
		const response = await instance.get(`/events/${eventId}/posts`);
		return response.data.data.posts;
	};

	return useQuery({
		queryKey: queryKeys.posts.byEvent(eventId),
		queryFn: getPostsByEventId,
	});
};

export default useGetPostsByEventIdQuery;
