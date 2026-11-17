import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/api/apiConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { GoogleLoginRequest, AuthResponse } from '@beatriz/shared/auth';

const useGoogleLoginMutation = () => {
	const navigate = useNavigate();

	const googleLogin = async (googleDataDetails: GoogleLoginRequest): Promise<AuthResponse> => {
		const uri = `${API_URL}/users/googleLogin`;
		const response = await axios.post<AuthResponse>(uri, googleDataDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: googleLogin,

		onSuccess: (data: AuthResponse) => {
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

export default useGoogleLoginMutation;
