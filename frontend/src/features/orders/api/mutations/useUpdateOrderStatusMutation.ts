import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { OrderDto, UpdateOrderStatusRequest, UpdateOrderStatusResponse } from '@beatriz/shared/orders';

interface UpdateOrderStatusVariables extends UpdateOrderStatusRequest {
	orderId: OrderDto['_id'];
}

const useUpdateOrderStatusMutation = () => {
	const queryClient = useQueryClient();

	const updateOrderStatus = async ({
		orderId,
		status,
	}: UpdateOrderStatusVariables): Promise<UpdateOrderStatusResponse> => {
		const payload: UpdateOrderStatusRequest = { status };
		const response = await instance.patch<UpdateOrderStatusResponse>(`/orders/${orderId}`, payload);

		return response.data;
	};

	return useMutation({
		mutationFn: updateOrderStatus,

		onSuccess: (_data: UpdateOrderStatusResponse, { status }: UpdateOrderStatusVariables) => {
			queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
			toast.success(status === 'paid' ? 'Wpłata została zatwierdzona' : 'Wpłata została odrzucona');
		},

		onError: () => {
			toast.error('Nie udało się zapisać decyzji');
		},
	});
};

export default useUpdateOrderStatusMutation;
