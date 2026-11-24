import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { EventDto, EventIdParams } from '@beatriz/shared/events';
import type { FavouriteEventResponse } from '@beatriz/shared/users';
import instance from '@/shared/api/apiConfig';

/** `refetch` refreshes the list of favourites after a successful add (same as the remove mutation). */
const useAddEventToFavouriteMutation = (refetch?: () => void) => {
	const addEventToFavourite = async (eventId: EventDto['_id']): Promise<FavouriteEventResponse> => {
		const payload: EventIdParams = { eventId };
		const response = await instance.post<FavouriteEventResponse>('/users/me/favourites', payload);
		return response.data;
	};

	return useMutation({
		mutationFn: addEventToFavourite,

		onSuccess: (data: FavouriteEventResponse) => {
			console.log(data);
			refetch?.();
			toast.success('Pomyślnie dodano wydarzenie do ulubionych');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się dodać wydarzenia do ulubionych');
		},
	});
};

export default useAddEventToFavouriteMutation;
