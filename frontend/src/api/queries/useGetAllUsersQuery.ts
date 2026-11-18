import { useQuery } from '@tanstack/react-query';
import instance from '@/api/apiConfig';
import { queryKeys } from '@/api/queryKeys';

const useGetAllUsersQuery = () => {
	const getAllUsers = async () => {
		const response = await instance.get('/users');
		return response.data.data.users;
	};

	return useQuery({
		queryKey: queryKeys.users.list(),
		queryFn: getAllUsers,
	});
};

export default useGetAllUsersQuery;
