import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '../apiConfig';

const useAddEventToFavouriteMutation = () => {
	const addEventToFavourite = async (eventId: string) => {
		const uri = `/users/addFavourite`;
		const response = await instance.post(uri, { eventId });
		return response.data;
	};

	return useMutation({
		mutationFn: addEventToFavourite,

		onSuccess: data => {
			console.log(data);
			toast.success('Pomyślnie dodano wydarzenie do ulubionych');
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Nie udało się dodać wydarzenia do ulubionych');
		},
	});
};

export default useAddEventToFavouriteMutation;
