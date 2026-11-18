import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { User } from '@beatriz/shared/users';

const useGetUserByIdQuery = (id: User['_id']) => {
	const getUserById = async () => {
		const response = await instance.get(`/users/${id}`);
		return response.data.data.user;
	};

	return useQuery({
		queryKey: queryKeys.users.detail(id),
		queryFn: getUserById,
	});
};

export default useGetUserByIdQuery;
