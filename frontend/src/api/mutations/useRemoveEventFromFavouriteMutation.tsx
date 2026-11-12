import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '../apiConfig';

const useRemoveEventFromFavouriteMutation = (refetch: () => void) => {
	const removeEventFromFavourite = async (eventId: string) => {
		const uri = `/users/removeFavourite`;
		const response = await instance.delete(uri, { data: { eventId } });
		return response.data;
	};

	return useMutation({
		mutationFn: removeEventFromFavourite,
		onSuccess: (data: any) => {
			refetch();
			console.log(data);
			toast.success('Successfully removed event from favourites');
		},

		onError: (error: any) => {
			console.log(`${error}`);
			toast.error('Failed to remove event from favourites');
		},
	});
};

export default useRemoveEventFromFavouriteMutation;
