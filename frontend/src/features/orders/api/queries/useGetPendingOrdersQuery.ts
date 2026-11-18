import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { GetAllOrdersResponse, OrderDto } from '@beatriz/shared/orders';

const useGetPendingOrdersQuery = () => {
	const getPendingOrders = async (): Promise<OrderDto[]> => {
		const response = await instance.get<GetAllOrdersResponse>('/orders', { params: { status: 'pending' } });

		return response.data.data.orders;
	};

	return useQuery({
		queryKey: queryKeys.orders.pending(),
		queryFn: getPendingOrders,
	});
};

export default useGetPendingOrdersQuery;
