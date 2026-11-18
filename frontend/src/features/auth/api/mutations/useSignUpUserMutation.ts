import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { isFailedResponse } from '@/shared/utils/response';
import type { AuthUserRequest, AuthResponse } from '@beatriz/shared/auth';
import { API_URL } from '@/shared/api/apiConfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setItemLocalStorage } from '@/shared/utils/localStorage';

const useSignUpUserMutation = () => {
	const navigate = useNavigate();

	const signUser = async (newUser: AuthUserRequest): Promise<AuthResponse> => {
		const uri = `${API_URL}/auth/signup`;
		const response = await axios.post<AuthResponse>(uri, newUser);
		return response.data;
	};

	return useMutation({
		mutationFn: signUser,

		onSuccess: (data: AuthResponse) => {
			if (isFailedResponse(data)) {
				throw new Error(data.message);
			}
			console.log(data);
			toast.success('Konto zostało pomyślnie stworzone');
			setItemLocalStorage('user-id', data.data.user._id);
			setItemLocalStorage('token', data.data.accessToken);

			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},

		onError: (error: Error) => {
			console.log(`Błąd:  ${error}`);
			toast.error('Próba stworzenia konta nie powiodła się');
		},
	});
};

export default useSignUpUserMutation;
