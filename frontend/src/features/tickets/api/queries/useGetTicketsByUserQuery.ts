import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { UserDto } from '@beatriz/shared/users';
import type { TicketDto } from '@beatriz/shared/tickets';

const useGetTicketsByUserQuery = (id: UserDto['_id']) => {
	const getTicketsByUser = async (): Promise<TicketDto[]> => {
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
