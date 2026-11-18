import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { EventResponse, Event } from '@beatriz/shared/events';

const useAddNewEventMutation = () => {
	const addNewEvent = async (newEvent: Event): Promise<EventResponse> => {
		const uri = '/events';
		const response = await instance.post<EventResponse>(uri, newEvent);
		return response.data;
	};

	return useMutation({
		mutationFn: addNewEvent,
		onSuccess: (data: EventResponse) => {
			console.log(data);
			toast.success('Pomyślnie dodano wydarzenie');
		},

		onError: (error: Error) => {
			console.log(`${error}`);
			toast.error('Nie udało się dodać wydarzenia');
		},
	});
};

export default useAddNewEventMutation;
