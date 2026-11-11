import { useQuery } from '@tanstack/react-query';
import instance from '../apiConfig';

const useGetFavouriteEventsQuery = () => {
	const getFavouriteEvents = async () => {
		const response = await instance.get('/users/favourite');
		return response.data.favouriteEvents;
	};

	return useQuery({
		queryKey: ['favourite-events'],
		queryFn: getFavouriteEvents,
	});
};

export default useGetFavouriteEventsQuery;
