import { API_URL } from '@/api/apiConfig';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import type { ResetPasswordRequest, ResetPasswordResponse } from '@beatriz/shared';

const useResetPasswordMutation = (resetToken: string) => {
	const navigate = useNavigate();

	const resetPassword = async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
		const uri = `${API_URL}/users/resetpassword/${resetToken}`;
		const response = await axios.patch<ResetPasswordResponse>(uri, data);
		return response.data;
	};

	return useMutation({
		mutationFn: resetPassword,
		onSuccess: (data: ResetPasswordResponse) => {
			console.log(data);
			toast.success('Successfully reset password');
			setTimeout(() => {
				navigate('/home');
			}, 2000);
		},
		onError: (error: unknown) => {
			console.log(error);
			toast.error('Failed');
		},
	});
};

export default useResetPasswordMutation;
