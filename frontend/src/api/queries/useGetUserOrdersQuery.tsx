import instance from '../apiConfig';
import { useQuery } from '@tanstack/react-query';

const useGetUserOrdersQuery = (id: string) => {
	const getUserOrders = async () => {
		console.log(id);
		const uri = `/orders/${id}`;
		const response = await instance.get(uri);
		return response.data.orders;
	};

	return useQuery({
		queryKey: [`userorders-${id}`],
		queryFn: getUserOrders,
	});
};

export default useGetUserOrdersQuery;
