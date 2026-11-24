import instance from '@/shared/api/apiConfig';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/api/queryKeys';
import type { UserDto } from '@beatriz/shared/users';

/** Fetches the orders of the logged-in user; does nothing while there is no user id. */
const useGetUserOrdersQuery = (id: UserDto['_id'] | null) => {
	const getUserOrders = async () => {
		const uri = '/users/me/orders';
		const response = await instance.get(uri);
		return response.data.data.orders;
	};

	return useQuery({
		queryKey: queryKeys.orders.byUser(id ?? ''),
		queryFn: getUserOrders,
		enabled: Boolean(id),
	});
};

export default useGetUserOrdersQuery;
