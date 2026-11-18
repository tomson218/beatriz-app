import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { Event, EventIdParams } from '@beatriz/shared/events';
import type { FavouriteEventResponse } from '@beatriz/shared/users';

const useRemoveEventFromFavouriteMutation = (refetch: () => void) => {
	const removeEventFromFavourite = async (eventId: Event["_id"]): Promise<FavouriteEventResponse> => {
		const uri = '/users/removeFavourite';
		const payload: EventIdParams = { eventId };
		const response = await instance.delete<FavouriteEventResponse>(uri, { data: payload });
		return response.data;
	};

	return useMutation({
		mutationFn: removeEventFromFavourite,
		onSuccess: (data: FavouriteEventResponse) => {
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
