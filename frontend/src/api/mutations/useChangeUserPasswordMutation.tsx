import { useMutation } from '@tanstack/react-query';
import instance from '../apiConfig';
import toast from 'react-hot-toast';

const useChangeUserPasswordMutation = () => {
	const changeUserPassword = async (data: any) => {
		const uri = '/users/updateMyPassword';
		const response = await instance.patch(uri, data);

		return response.data;
	};

	return useMutation({
		mutationFn: changeUserPassword,

		onSuccess: (data: any) => {
			localStorage.setItem('token', data.token);
			toast.success('Pomyślnie zmieniono hasło');
		},

		onError: (error: any) => {
			console.log(error);
			toast.error('Zmiana hasła nie powiodła się');
		},
	});
};

export default useChangeUserPasswordMutation;
