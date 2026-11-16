import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/api/apiConfig';
import { queryKeys } from '@/api/queryKeys';
import type { Event } from '@beatriz/shared/events';

const useGetEventByIdQuery = (id: Event['_id']) => {
	const getEventById = async () => {
		const uri = `${API_URL}/events/${id}`;
		const response = await axios.get(uri);
		return response.data.event;
	};

	return useQuery({
		queryKey: queryKeys.events.detail(id),
		queryFn: getEventById,
	});
};

export default useGetEventByIdQuery;
