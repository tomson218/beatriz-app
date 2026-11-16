import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { FavouriteEventRequest, GetUserFavoriteEventsResponse } from '@beatriz/shared';

const useRemoveEventFromFavouriteMutation = (refetch: () => void) => {
	const removeEventFromFavourite = async (eventId: string): Promise<GetUserFavoriteEventsResponse> => {
		const uri = '/users/removeFavourite';
		const payload: FavouriteEventRequest = { eventId };
		const response = await instance.delete<GetUserFavoriteEventsResponse>(uri, { data: payload });
		return response.data;
	};

	return useMutation({
		mutationFn: removeEventFromFavourite,
		onSuccess: (data: GetUserFavoriteEventsResponse) => {
			refetch();
			console.log(data);
			toast.success('Successfully removed event from favourites');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Failed to remove event from favourites');
		},
	});
};

export default useRemoveEventFromFavouriteMutation;
