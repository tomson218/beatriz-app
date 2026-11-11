import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { User } from '../../interfaces/User';
import { API_URL } from '../apiConfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setItemLocalStorage } from '@/utils/localStorage';

const useSignUpUserMutation = () => {
	const navigate = useNavigate();

	const signUser = async (newUser: User) => {
		const uri = `${API_URL}/users/signup`;
		const response = await axios.post(uri, newUser);
		return response.data;
	};

	return useMutation({
		mutationFn: signUser,

		onSuccess: data => {
			console.log(data);
			toast.success('Konto zostało pomyślnie stworzone');
			setItemLocalStorage('user-id', data.user._id);
			setItemLocalStorage('token', data.token);

			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},

		onError: error => {
			console.log(`Bład:  ${error}`);
			toast.error('Próba stworzenia konta nie powiodła się');
		},
	});
};

export default useSignUpUserMutation;
