import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '../apiConfig';

const useApplyDiscountCodeMutation = () => {
	const applyDiscountCode = async discountDetails => {
		const uri = `/discount-codes/applyCode`;
		const response = await instance.post(uri, discountDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: applyDiscountCode,
		onSuccess: (data: any, variables: any) => {
			console.log(data);
			toast.success('Pomyślnie zastosowany rabat');
		},

		onError: (error: any) => {
			console.log(`${error}`);
			toast.error('Nie udało się zastosować rabatu');
		},
	});
};

export default useApplyDiscountCodeMutation;
