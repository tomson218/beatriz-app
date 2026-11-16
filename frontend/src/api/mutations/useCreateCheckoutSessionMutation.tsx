import instance from '@/api/apiConfig';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from '@beatriz/shared/payments';

const useCreateCheckoutSessionMutation = () => {
	const createCheckoutSession = async (
		lineItems: CreateCheckoutSessionRequest['products'],
	): Promise<CreateCheckoutSessionResponse> => {
		const uri = '/create-checkout-session';
		const payload: CreateCheckoutSessionRequest = {
			products: lineItems,
		};
		const response = await instance.post<CreateCheckoutSessionResponse>(uri, payload);
		return response.data;
	};

	return useMutation({
		mutationFn: createCheckoutSession,

		onSuccess: (data: CreateCheckoutSessionResponse) => {
			console.log(data);
			toast.success('Pomyślnie utworzono sesję realizacji zakupu');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nieudane utworzenie sesji realizacji zakupu');
		},
	});
};

export default useCreateCheckoutSessionMutation;
