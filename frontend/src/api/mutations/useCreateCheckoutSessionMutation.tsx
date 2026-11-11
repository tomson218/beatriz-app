import instance from '../apiConfig';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useCreateCheckoutSessionMutation = () => {
	const createCheckoutSession = async (lineItems: {}[]) => {
		const uri = `/create-checkout-session`;
		const response = await instance.post(uri, {
			products: lineItems,
			discountCode: JSON.parse(localStorage.getItem('code')),
		});
		return response.data;
	};

	return useMutation({
		mutationFn: createCheckoutSession,

		onSuccess: data => {
			console.log(data);
			toast.success('Pomyślnie utworzono sesję realizacji zakupu');
			setTimeout(() => {
				window.location.href = data.url;
			}, 1000);
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Nieudane utworzenie sesji realizacji zakupu');
		},
	});
};

export default useCreateCheckoutSessionMutation;
