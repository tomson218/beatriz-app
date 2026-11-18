import instance from '@/api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/api/queryKeys';
import type { User } from '@beatriz/shared/users';

const useGetUserOrdersQuery = (id: User['_id']) => {
	const getUserOrders = async () => {
		console.log(id);
		const uri = `/orders/${id}`;
		const response = await instance.get(uri);
		return response.data.data.orders;
	};

	return useQuery({
		queryKey: queryKeys.orders.byUser(id),
		queryFn: getUserOrders,
	});
};

export default useGetUserOrdersQuery;
