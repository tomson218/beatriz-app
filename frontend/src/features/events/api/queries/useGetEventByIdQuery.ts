import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { EventDto } from '@beatriz/shared/events';

const useGetEventByIdQuery = (id: EventDto['_id']) => {
	const getEventById = async (): Promise<EventDto> => {
		const response = await instance.get(`/events/${id}`);
		return response.data.data.event;
	};

	return useQuery({
		queryKey: queryKeys.events.detail(id),
		queryFn: getEventById,
	});
};

export default useGetEventByIdQuery;
