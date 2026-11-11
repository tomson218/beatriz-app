import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../apiConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const useFacebookLoginMutation = () => {
	const navigate = useNavigate();

	const facebookLogin = async facebookDataDetails => {
		const uri = `${API_URL}/users/facebookLogin`;
		const response = await axios.post(uri, facebookDataDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: facebookLogin,

		onSuccess: data => {
			console.log(data);

			localStorage.setItem('user-id', data.user._id);
			localStorage.setItem('token', data.token);

			toast.success('Pomyślne zalogowanie');
			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Nie udało się zalogować');
		},
	});
};

export default useFacebookLoginMutation;
