import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import type { SignUpRequest, SignUpResponse } from '@beatriz/shared';
import { API_URL } from '@/api/apiConfig';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { setItemLocalStorage } from '@/utils/localStorage';

const useSignUpUserMutation = () => {
	const navigate = useNavigate();

	const signUser = async (newUser: SignUpRequest): Promise<SignUpResponse> => {
		const uri = `${API_URL}/auth/signup`;
		const response = await axios.post<SignUpResponse>(uri, newUser);
		return response.data;
	};

	return useMutation({
		mutationFn: signUser,

		onSuccess: (data: SignUpResponse) => {
			if (data.status !== 'success') {
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

		onError: (error: any) => {
			console.log(`Bład:  ${error}`);
			toast.error('Próba stworzenia konta nie powiodła się');
		},
	});
};

export default useSignUpUserMutation;
