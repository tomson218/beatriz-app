import { API_URL } from '../apiConfig';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';

const useGetPostsByEventIdQuery = (eventId: string) => {
	const getPostsByEventId = async () => {
		const uri = `${API_URL}/forum/${eventId}`;
		const response = await axios.get(uri);
		return response.data.forumPosts;
	};

	return useQuery({
		queryKey: [`posts-by-${eventId}`],
		queryFn: getPostsByEventId,
	});
};

export default useGetPostsByEventIdQuery;
