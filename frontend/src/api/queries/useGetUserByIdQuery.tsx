import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../apiConfig';

const useGetUserByIdQuery = (id: string) => {
	const getUserById = async () => {
		const uri = `${API_URL}/users/${id}`;
		const response = await axios.get(uri);
		return response.data.user;
	};

	return useQuery({
		queryKey: [`user-${id}`],
		queryFn: getUserById,
	});
};

export default useGetUserByIdQuery;
