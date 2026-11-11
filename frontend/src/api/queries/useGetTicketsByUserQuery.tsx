import { useQuery } from '@tanstack/react-query';
import instance from '../apiConfig';

const useGetTicketsByUserQuery = (id: string) => {
	const getTicketsByUser = async () => {
		const uri = `/tickets/${id}`;
		const response = await instance.get(uri);
		return response.data.tickets;
	};

	return useQuery({
		queryKey: [`ticketsuser-${id}`],
		queryFn: getTicketsByUser,
	});
};

export default useGetTicketsByUserQuery;
