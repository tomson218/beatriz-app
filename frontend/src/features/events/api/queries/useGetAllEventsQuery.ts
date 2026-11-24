import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { EventDto } from '@beatriz/shared/events';

const useGetAllEventsQuery = () => {
	const getAllEvents = async (): Promise<EventDto[]> => {
		const response = await instance.get('/events');
		return response.data.data.events;
	};

	return useQuery({
		queryKey: queryKeys.events.list(),
		queryFn: getAllEvents,
	});
};

export default useGetAllEventsQuery;
