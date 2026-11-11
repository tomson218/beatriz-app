import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { User } from '../../interfaces/User';
import { API_URL } from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setItemLocalStorage } from '@/utils/localStorage';

const useLoginUserMutation = () => {
	const navigate = useNavigate();

	const loginUser = async (user: User) => {
		const uri = `${API_URL}/users/login`;
		const response = await axios.post(uri, user);
		return response.data;
	};

	return useMutation({
		mutationFn: loginUser,

		onSuccess: data => {
			console.log(data);
			setItemLocalStorage('token', data.token);
			document.cookie = 'token=' + data.token;
			setItemLocalStorage('user-id', data.user._id);
			toast.success('Pomyślnie zalogowano się');
			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Logowanie nie powiodło się');
		},
	});
};

export default useLoginUserMutation;
