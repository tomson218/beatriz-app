import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/shared/api/apiConfig';
import type { EventResponse } from '@beatriz/shared/events';

const useAddNewEventMutation = () => {
	/** Multipart form data: the event fields plus an optional image file. */
	const addNewEvent = async (newEvent: FormData): Promise<EventResponse> => {
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
