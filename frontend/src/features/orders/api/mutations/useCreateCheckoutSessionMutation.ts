import instance from '@/shared/api/apiConfig';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getStoredDiscountCode } from '@/features/orders/utils/discountCode';
import type { CreateCheckoutSessionRequest, CreateCheckoutSessionResponse } from '@beatriz/shared/payments';

const useCreateCheckoutSessionMutation = () => {
	const createCheckoutSession = async (
		lineItems: CreateCheckoutSessionRequest['products'],
	): Promise<CreateCheckoutSessionResponse> => {
		const uri = '/checkout-sessions';
		const payload: CreateCheckoutSessionRequest = {
			products: lineItems,
			discountCode: getStoredDiscountCode(),
		};
		const response = await instance.post<CreateCheckoutSessionResponse>(uri, payload);
		return response.data;
	};

	return useMutation({
		mutationFn: createCheckoutSession,

		onSuccess: (data: CreateCheckoutSessionResponse) => {
			if (data.url) {
				window.location.assign(data.url);
			}
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nieudane utworzenie sesji realizacji zakupu');
		},
	});
};

export default useCreateCheckoutSessionMutation;
