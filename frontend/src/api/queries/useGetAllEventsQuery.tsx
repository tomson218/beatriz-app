import { useQuery } from '@tanstack/react-query';
import instance from '../apiConfig';

const useGetAllEventsQuery = () => {
	const getAllEvents = async () => {
		const response = await instance.get('/events');
		return response.data.events;
	};

	return useQuery({
		queryKey: ['events'],
		queryFn: getAllEvents,
	});
};

export default useGetAllEventsQuery;
