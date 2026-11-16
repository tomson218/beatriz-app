import { useMutation } from '@tanstack/react-query';
import instance from '@/api/apiConfig';
import toast from 'react-hot-toast';
import type { UpdatePasswordRequest, UpdatePasswordResponse } from '@beatriz/shared';

const useChangeUserPasswordMutation = () => {
	const changeUserPassword = async (data: UpdatePasswordRequest): Promise<UpdatePasswordResponse> => {
		const uri = '/users/updateMyPassword';
		const response = await instance.patch<UpdatePasswordResponse>(uri, data);
		return response.data;
	};

	return useMutation({
		mutationFn: changeUserPassword,

		onSuccess: (data: UpdatePasswordResponse) => {
			if (data.status === 'success') {
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
