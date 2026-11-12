import { API_URL } from '../apiConfig';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const useResetPasswordMutation = (resetToken: string) => {
	const navigate = useNavigate();

	const resetPassword = async (data: {}) => {
		const uri = `${API_URL}/users/resetpassword/${resetToken}`;
		const response = await axios.patch(uri, data);
		return response.data;
	};

	return useMutation({
		mutationFn: resetPassword,
		onSuccess: (data: any) => {
			console.log(data);
			toast.success('Successfully reset password');
			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},
		onError: (error: any) => {
			console.log(`rolling back optimistic update with id ${error}`);
			toast.error('Failed');
		},
	});
};

export default useResetPasswordMutation;
