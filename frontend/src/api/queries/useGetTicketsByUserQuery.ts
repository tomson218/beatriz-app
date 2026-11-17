import { useQuery } from '@tanstack/react-query';
import instance from '@/api/apiConfig';
import { queryKeys } from '@/api/queryKeys';
import type { User } from '@beatriz/shared/users';

const useGetTicketsByUserQuery = (id: User['_id']) => {
	const getTicketsByUser = async () => {
		const uri = `/tickets/${id}`;
		const response = await instance.get(uri);
		return response.data.tickets;
	};

	return useQuery({
		queryKey: queryKeys.tickets.byUser(id),
		queryFn: getTicketsByUser,
	});
};

export default useGetTicketsByUserQuery;
