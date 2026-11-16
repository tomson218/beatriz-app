import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '@/api/apiConfig';
import toast from 'react-hot-toast';
import type { ForgetPasswordRequest, ForgetPasswordResponse } from '@beatriz/shared';

const useForgetPasswordMutation = () => {
	const forgetPassword = async (email: string): Promise<ForgetPasswordResponse> => {
		const uri = `${API_URL}/users/forgetPassword`;
		const payload: ForgetPasswordRequest = { email };
		const response = await axios.post<ForgetPasswordResponse>(uri, payload);
		return response.data;
	};

	return useMutation({
		mutationFn: forgetPassword,

		onSuccess: (data: ForgetPasswordResponse) => {
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
