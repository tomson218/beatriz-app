import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/api/apiConfig';
import toast from 'react-hot-toast';
import type { ForgetPasswordRequest, MessageResponse } from '@beatriz/shared/auth';

const useForgetPasswordMutation = () => {
	const forgetPassword = async (email: string): Promise<MessageResponse> => {
		const uri = `${API_URL}/auth/forgetPassword`;
		const payload: ForgetPasswordRequest = { email };
		const response = await axios.post<MessageResponse>(uri, payload);
		return response.data;
	};

	return useMutation({
		mutationFn: forgetPassword,

		onSuccess: (data: MessageResponse) => {
			console.log(data);
			toast.success('Success');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Error');
		},
	});
};

export default useForgetPasswordMutation;
