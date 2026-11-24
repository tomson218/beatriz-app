import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/shared/api/apiConfig';
import type { EventDto } from '@beatriz/shared/events';

const useRemoveEventFromFavouriteMutation = (refetch: () => void) => {
	const removeEventFromFavourite = async (eventId: EventDto['_id']): Promise<void> => {
		await instance.delete(`/users/me/favourites/${eventId}`);
	};

	return useMutation({
		mutationFn: removeEventFromFavourite,
		onSuccess: () => {
			refetch();
			toast.success('Successfully removed event from favourites');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Failed to remove event from favourites');
		},
	});
};

export default useRemoveEventFromFavouriteMutation;
