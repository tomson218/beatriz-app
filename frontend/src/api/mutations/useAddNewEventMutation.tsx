import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { CreateEventResponse, Event } from '@beatriz/shared/events';

const useAddNewEventMutation = () => {
	const addNewEvent = async (newEvent: Event): Promise<CreateEventResponse> => {
		const uri = '/events';
		const response = await instance.post<CreateEventResponse>(uri, newEvent);
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
