import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/api/apiConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { FacebookLoginRequest, FacebookLoginResponse } from '@beatriz/shared/auth';

const useFacebookLoginMutation = () => {
	const navigate = useNavigate();

	const facebookLogin = async (facebookDataDetails: FacebookLoginRequest): Promise<FacebookLoginResponse> => {
		const uri = `${API_URL}/users/facebookLogin`;
		const response = await axios.post<FacebookLoginResponse>(uri, facebookDataDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: facebookLogin,

		onSuccess: (data: FacebookLoginResponse) => {
			console.log(data);

			if (data.status === 'success') {
				localStorage.setItem('user-id', data.data.user._id);
				localStorage.setItem('token', data.data.accessToken);
			}

			toast.success('Pomyślne zalogowanie');
			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się zalogować');
		},
	});
};

export default useFacebookLoginMutation;
