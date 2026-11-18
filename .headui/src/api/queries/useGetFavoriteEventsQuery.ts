import { useQuery } from '@tanstack/react-query';
import instance from '@/api/apiConfig';
import { queryKeys } from '@/api/queryKeys';

const useGetFavouriteEventsQuery = () => {
	const getFavouriteEvents = async () => {
		const response = await instance.get('/users/favourite');
		return response.data.data.events;
	};

	return useQuery({
		queryKey: queryKeys.favourites.list(),
		queryFn: getFavouriteEvents,
	});
};

export default useGetFavouriteEventsQuery;
