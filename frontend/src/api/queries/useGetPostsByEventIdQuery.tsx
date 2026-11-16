import { API_URL } from '@/api/apiConfig';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import type { Event } from '@beatriz/shared/events';
import { queryKeys } from '@/api/queryKeys';

const useGetPostsByEventIdQuery = (eventId: Event["_id"]) => {
	const getPostsByEventId = async () => {
		const uri = `${API_URL}/forum/${eventId}`;
		const response = await axios.get(uri);
		return response.data.forumPosts;
	};

	return useQuery({
		queryKey: queryKeys.posts.byEvent(eventId),
		queryFn: getPostsByEventId,
	});
};

export default useGetPostsByEventIdQuery;
