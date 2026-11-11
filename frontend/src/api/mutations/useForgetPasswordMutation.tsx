import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { API_URL } from '../apiConfig';
import toast from 'react-hot-toast';

const useForgetPasswordMutation = () => {
	const forgetPassword = async (email: string) => {
		const uri = `${API_URL}/users/forgetPassword`;
		const response = await axios.post(uri, email);
		return response.data;
	};

	return useMutation({
		mutationFn: forgetPassword,

		onSuccess: data => {
			console.log(data);
			toast.success('Success');
		},

		onError: error => {
			console.log(error);
			toast.error('Error');
		},
	});
};

export default useForgetPasswordMutation;
