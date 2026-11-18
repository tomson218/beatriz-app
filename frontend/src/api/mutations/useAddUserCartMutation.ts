import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { AddCartRequest, AddCartResponse } from '@beatriz/shared/users';

const useAddUserCartMutation = () => {
	const addUserCart = async (cart: AddCartRequest['cart']): Promise<AddCartResponse> => {
		const uri = '/users/me/cart';
		const payload: AddCartRequest = { cart };
		const response = await instance.put<AddCartResponse>(uri, payload);
		return response.data;
	};

	return useMutation({
		mutationFn: addUserCart,
		onSuccess: (data: AddCartResponse) => {
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
