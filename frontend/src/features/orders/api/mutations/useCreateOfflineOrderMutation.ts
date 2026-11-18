import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import { getStoredDiscountCode } from '@/features/orders/utils/discountCode';
import type { CreateOfflineOrderRequest, CreateOrderResponse } from '@beatriz/shared/orders';

const useCreateOfflineOrderMutation = () => {
	const queryClient = useQueryClient();

	const createOfflineOrder = async (products: CreateOfflineOrderRequest['products']): Promise<CreateOrderResponse> => {
		const payload: CreateOfflineOrderRequest = { products, discountCode: getStoredDiscountCode() };
		const response = await instance.post<CreateOrderResponse>('/orders', payload);

		return response.data;
	};

	return useMutation({
		mutationFn: createOfflineOrder,

		onSuccess: () => {
			localStorage.removeItem('code');
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
			toast.success('Zamówienie czeka na potwierdzenie wpłaty');
		},

		onError: (error: AxiosError) => {
			const isSeatTaken = error.response?.status === 409;

			toast.error(isSeatTaken ? 'Wybrane miejsce jest już zajęte' : 'Nie udało się złożyć zamówienia');
		},
	});
};

export default useCreateOfflineOrderMutation;
