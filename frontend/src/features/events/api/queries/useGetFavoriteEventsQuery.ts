import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { EventDto } from '@beatriz/shared/events';

const useGetFavouriteEventsQuery = () => {
	const getFavouriteEvents = async (): Promise<EventDto[]> => {
		const response = await instance.get('/users/me/favourites');
		return response.data.data.events;
	};

	return useQuery({
		queryKey: queryKeys.favourites.list(),
		queryFn: getFavouriteEvents,
	});
};

export default useGetFavouriteEventsQuery;
