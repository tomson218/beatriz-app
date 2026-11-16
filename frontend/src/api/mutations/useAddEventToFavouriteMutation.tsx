import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { FavouriteEventRequest, GetUserFavoriteEventsResponse } from '@beatriz/shared';
import instance from '@/api/apiConfig';

const useAddEventToFavouriteMutation = () => {
	const addEventToFavourite = async (eventId: string): Promise<GetUserFavoriteEventsResponse> => {
		const payload: FavouriteEventRequest = { eventId };
		const response = await instance.post<GetUserFavoriteEventsResponse>('/users/addFavourite', payload);
		return response.data;
	};

	return useMutation({
		mutationFn: addEventToFavourite,

		onSuccess: (data: GetUserFavoriteEventsResponse) => {
			console.log(data);
			toast.success('Pomyślnie dodano wydarzenie do ulubionych');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się dodać wydarzenia do ulubionych');
		},
	});
};

export default useAddEventToFavouriteMutation;
