import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { ApplyDiscountCodeRequest, ApplyDiscountCodeResponse } from '@beatriz/shared/discountCodes';

const useApplyDiscountCodeMutation = () => {
	const applyDiscountCode = async (discountDetails: ApplyDiscountCodeRequest): Promise<ApplyDiscountCodeResponse> => {
		const uri = '/discount-codes/apply';
		const response = await instance.post<ApplyDiscountCodeResponse>(uri, discountDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: applyDiscountCode,
		onSuccess: (data: ApplyDiscountCodeResponse) => {
			console.log(data);
			toast.success('Pomyślnie zastosowany rabat');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się zastosować rabatu');
		},
	});
};

export default useApplyDiscountCodeMutation;
