import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_URL } from '../apiConfig';

const useGetAllUsersQuery = () => {
	const getAllUsers = async () => {
		const uri = `${API_URL}/users`;
		const response = await axios.get(uri);
		return response.data.users;
	};

	return useQuery({
		queryKey: ['users'],
		queryFn: getAllUsers,
	});
};

export default useGetAllUsersQuery;
