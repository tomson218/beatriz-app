import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '@/api/apiConfig';
import { queryKeys } from '@/api/queryKeys';
import type { User } from '@beatriz/shared/users';

const useGetUserByIdQuery = (id: User['_id']) => {
	const getUserById = async () => {
		const uri = `${API_URL}/users/${id}`;
		const response = await axios.get(uri);
		return response.data.user;
	};

	return useQuery({
		queryKey: queryKeys.users.detail(id),
		queryFn: getUserById,
	});
};

export default useGetUserByIdQuery;
