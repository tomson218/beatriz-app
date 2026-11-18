import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { Event } from '@beatriz/shared/events';

const useGetEventByIdQuery = (id: Event['_id']) => {
	const getEventById = async () => {
		const response = await instance.get(`/events/${id}`);
		return response.data.data.event;
	};

	return useQuery({
		queryKey: queryKeys.events.detail(id),
		queryFn: getEventById,
	});
};

export default useGetEventByIdQuery;
