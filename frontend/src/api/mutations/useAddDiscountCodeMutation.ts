import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { DiscountCodeDto } from '@beatriz/shared/discountCodes';
import type { SuccessItem } from '@beatriz/shared/common';

const useAddDiscountCodeMutation = () => {
	const addDiscountCode = async (discountCode: DiscountCodeDto): Promise<SuccessItem<DiscountCodeDto>> => {
		const uri = '/discount-codes';
		const response = await instance.post<SuccessItem<DiscountCodeDto>>(uri, discountCode);
		return response.data;
	};

	return useMutation({
		mutationFn: addDiscountCode,

		onSuccess: (data: SuccessItem<DiscountCodeDto>) => {
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
