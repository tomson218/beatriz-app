import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';

const useGetAllEventsQuery = () => {
	const getAllEvents = async () => {
		const response = await instance.get('/events');
		return response.data.data.events;
	};

	return useQuery({
		queryKey: queryKeys.events.list(),
		queryFn: getAllEvents,
	});
};

export default useGetAllEventsQuery;
