import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { isFailedResponse } from '@/shared/utils/response';
import type { AuthResponse, LoginRequest } from '@beatriz/shared/auth';
import { API_URL } from '@/shared/api/apiConfig';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { setItemLocalStorage } from '@/shared/utils/localStorage';

const useLoginUserMutation = () => {
	const navigate = useNavigate();

	const loginUser = async (user: LoginRequest): Promise<AuthResponse> => {
		const uri = `${API_URL}/auth/login`;
		const response = await axios.post<AuthResponse>(uri, user);
		return response.data;
	};

	return useMutation({
		mutationFn: loginUser,

		onSuccess: (data: AuthResponse) => {
			if (isFailedResponse(data)) {
				throw new Error(data.message);
			}
			console.log(data);
			setItemLocalStorage('token', data.data.accessToken);
			document.cookie = 'token=' + data.data.accessToken;
			setItemLocalStorage('user-id', data.data.user._id);
			toast.success('Pomyślnie zalogowano się');
			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},

		onError: (error: Error) => {
			console.log(`${error}`);
			toast.error('Logowanie nie powiodło się');
		},
	});
};

export default useLoginUserMutation;
