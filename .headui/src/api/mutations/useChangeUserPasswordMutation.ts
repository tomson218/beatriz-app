import { useMutation } from '@tanstack/react-query';
import { isSuccessResponse } from '@/utils/response';
import instance from '@/api/apiConfig';
import toast from 'react-hot-toast';
import type { UpdatePasswordRequest, AuthResponse } from '@beatriz/shared/auth';

const useChangeUserPasswordMutation = () => {
	const changeUserPassword = async (data: UpdatePasswordRequest): Promise<AuthResponse> => {
		const uri = '/auth/updateMyPassword';
		const response = await instance.patch<AuthResponse>(uri, data);
		return response.data;
	};

	return useMutation({
		mutationFn: changeUserPassword,

		onSuccess: (data: AuthResponse) => {
			if (isSuccessResponse(data)) {
				localStorage.setItem('token', data.data.accessToken);
			}
			toast.success('Pomyślnie zmieniono hasło');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Zmiana hasła nie powiodła się');
		},
	});
};

export default useChangeUserPasswordMutation;
