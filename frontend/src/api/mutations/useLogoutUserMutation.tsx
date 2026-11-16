import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { LogoutResponse } from '@beatriz/shared/auth';

const useLogoutUserMutation = () => {
	const navigate = useNavigate();

	const logoutUser = async (): Promise<LogoutResponse> => {
		const uri = '/auth/logout';
		const response = await instance.post<LogoutResponse>(uri);
		return response.data;
	};

	return useMutation({
		mutationFn: logoutUser,

		onSuccess: (data: LogoutResponse) => {
			console.log(data);
			localStorage.clear();
			toast.success('Pomyślnie wylogowano się');
			setTimeout(() => {
				navigate('/');
			}, 1000);
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Wylogowanie nie powiodło się');
		},
	});
};

export default useLogoutUserMutation;
