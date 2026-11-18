import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { User } from '@beatriz/shared/users';

const useGetTicketsByUserQuery = (id: User['_id']) => {
	const getTicketsByUser = async () => {
		const uri = `/users/${id}/tickets`;
		const response = await instance.get(uri);
		return response.data.data.tickets;
	};

	return useQuery({
		queryKey: queryKeys.tickets.byUser(id),
		queryFn: getTicketsByUser,
	});
};

export default useGetTicketsByUserQuery;
