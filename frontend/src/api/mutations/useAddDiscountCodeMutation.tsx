import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '../apiConfig';
import { DiscountCode } from '@/interfaces/DiscountCode';

const useAddDiscountCodeMutation = () => {
	const addDiscountCode = async (discountCode: DiscountCode) => {
		const uri = `/discount-codes`;
		const response = await instance.post(uri, discountCode);
		return response.data;
	};

	return useMutation({
		mutationFn: addDiscountCode,

		onSuccess: data => {
			console.log(data);
			toast.success('Pomyślnie dodano nowy kod');
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Nie udało się dodać nowego kodu');
		},
	});
};

export default useAddDiscountCodeMutation;
