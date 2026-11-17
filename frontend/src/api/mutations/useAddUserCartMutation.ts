import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { AddCartRequest } from '@beatriz/shared/users';
import type { SuccessList } from '@beatriz/shared/common';

const useAddUserCartMutation = () => {
	const addUserCart = async (cart: AddCartRequest['cart']): Promise<SuccessList<unknown>> => {
		const uri = '/users/addCart';
		const payload: AddCartRequest = { cart };
		const response = await instance.post<SuccessList<unknown>>(uri, payload);
		return response.data;
	};

	return useMutation({
		mutationFn: addUserCart,
		onSuccess: (data: SuccessList<unknown>) => {
			console.log(data);
			toast.success('Pomyślnie dodano do koszyka');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się dodać do koszyka');
		},
	});
};

export default useAddUserCartMutation;
