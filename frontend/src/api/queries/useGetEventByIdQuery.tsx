import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../apiConfig';

const useGetEventByIdQuery = (id: string) => {
	const getEventById = async () => {
		const uri = `${API_URL}/events/${id}`;
		const response = await axios.get(uri);
		return response.data.event;
	};

	return useQuery({
		queryKey: [`event-${id}`],
		queryFn: getEventById,
	});
};

export default useGetEventByIdQuery;
