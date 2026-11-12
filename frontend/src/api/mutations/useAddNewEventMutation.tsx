import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '../apiConfig';
import { Event } from '@/interfaces/Event';

const useAddNewEventMutation = () => {
	const addNewEvent = async (newEvent: Event) => {
		const uri = `/events`;
		const response = await instance.post(uri, newEvent);
		return response.data;
	};

	return useMutation({
		mutationFn: addNewEvent,
		onSuccess: (data: any) => {
			console.log(data);
			toast.success('Pomyślnie dodano wydarzenie');
		},

		onError: (error: any) => {
			console.log(`${error}`);
			toast.error('Nie udało się dodać wydarzenia');
		},
	});
};

export default useAddNewEventMutation;
