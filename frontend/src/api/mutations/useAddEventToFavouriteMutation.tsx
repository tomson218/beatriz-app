import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { Event, EventIdParams } from '@beatriz/shared/events';
import type { GetUserFavoriteEventsResponse } from '@beatriz/shared/users';
import instance from '@/api/apiConfig';

const useAddEventToFavouriteMutation = () => {
	const addEventToFavourite = async (eventId: Event["_id"]): Promise<GetUserFavoriteEventsResponse> => {
		const payload: EventIdParams = { eventId };
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
