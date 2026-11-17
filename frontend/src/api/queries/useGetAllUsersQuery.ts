import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/api/apiConfig';
import { queryKeys } from '@/api/queryKeys';

const useGetAllUsersQuery = () => {
	const getAllUsers = async () => {
		const uri = `${API_URL}/users`;
		const response = await axios.get(uri);
		return response.data.users;
	};

	return useQuery({
		queryKey: queryKeys.users.list(),
		queryFn: getAllUsers,
	});
};

export default useGetAllUsersQuery;
