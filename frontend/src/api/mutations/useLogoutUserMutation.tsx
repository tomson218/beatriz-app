import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const useLogoutUserMutation = () => {
	const navigate = useNavigate();

	const logoutUser = async () => {
		const uri = `${API_URL}/users/logout`;
		const response = await axios.post(uri);
		return response.data;
	};

	return useMutation({
		mutationFn: logoutUser,

		onSuccess: data => {
			console.log(data);

			localStorage.clear();
			toast.success('Pomyślnie wylogowano się');
			setTimeout(() => {
				navigate('/');
			}, 1000);
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Wylogowanie nie powiodło się');
		},
	});
};

export default useLogoutUserMutation;
