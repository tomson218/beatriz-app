import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { AddDiscountCodeResponse, DiscountCodeDto } from '@beatriz/shared/discountCodes';

const useAddDiscountCodeMutation = () => {
	const addDiscountCode = async (discountCode: DiscountCodeDto): Promise<AddDiscountCodeResponse> => {
		const uri = '/discount-codes';
		const response = await instance.post<AddDiscountCodeResponse>(uri, discountCode);
		return response.data;
	};

	return useMutation({
		mutationFn: addDiscountCode,

		onSuccess: (data: AddDiscountCodeResponse) => {
			console.log(data);
			toast.success('Pomyślnie dodano nowy kod');
		},

		onError: (error: Error) => {
			console.log(`${error}`);
			toast.error('Nie udało się dodać nowego kodu');
		},
	});
};

export default useAddDiscountCodeMutation;
