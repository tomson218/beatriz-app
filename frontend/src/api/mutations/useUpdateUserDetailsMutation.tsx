import { useMutation } from '@tanstack/react-query';
import { User } from '../../interfaces/User';
import toast from 'react-hot-toast';
import instance from '../apiConfig';

const useUpdateUserDetailsMutation = () => {
	const updateUserDetails = async (updatedUser: User) => {
		const uri = `/users/updateMe`;
		const response = await instance.patch(uri, updatedUser);
		return response.data;
	};

	return useMutation({
		mutationFn: updateUserDetails,

		onSuccess: (data: any) => {
			console.log(data);
			toast.success('Successfully updated user details');
		},

		onError: (error: any) => {
			console.log(`${error}`);
			toast.error('Failed to update user details');
		},
	});
};

export default useUpdateUserDetailsMutation;
