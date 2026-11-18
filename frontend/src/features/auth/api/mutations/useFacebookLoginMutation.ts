import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { isSuccessResponse } from '@/shared/utils/response';
import { API_URL } from '@/shared/api/apiConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { FacebookLoginRequest, AuthResponse } from '@beatriz/shared/auth';

const useFacebookLoginMutation = () => {
	const navigate = useNavigate();

	const facebookLogin = async (facebookDataDetails: FacebookLoginRequest): Promise<AuthResponse> => {
		const uri = `${API_URL}/auth/facebook`;
		const response = await axios.post<AuthResponse>(uri, facebookDataDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: facebookLogin,

		onSuccess: (data: AuthResponse) => {
			console.log(data);

			if (isSuccessResponse(data)) {
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
