import { useQuery } from '@tanstack/react-query';
import instance from '@/shared/api/apiConfig';
import { queryKeys } from '@/shared/api/queryKeys';
import type { UserDto } from '@beatriz/shared/users';

/** Fetches the user; does nothing while there is no id (e.g. nobody is logged in). */
const useGetUserByIdQuery = (id: UserDto['_id'] | null) => {
	const getUserById = async () => {
		const response = await instance.get(`/users/${id}`);
		return response.data.data.user;
	};

	return useQuery({
		queryKey: queryKeys.users.detail(id ?? ''),
		queryFn: getUserById,
		enabled: Boolean(id),
	});
};

export default useGetUserByIdQuery;
