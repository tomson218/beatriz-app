import { useMutation } from '@tanstack/react-query';
import type { UpdateUserRequest, UpdateUserResponse } from '@beatriz/shared';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';

const useUpdateUserDetailsMutation = () => {
	const updateUserDetails = async (updatedUser: UpdateUserRequest): Promise<UpdateUserResponse> => {
		const uri = '/users/updateMe';
		const response = await instance.patch<UpdateUserResponse>(uri, updatedUser);
		return response.data;
	};

	return useMutation({
		mutationFn: updateUserDetails,

		onSuccess: (data: UpdateUserResponse) => {
			console.log(data);
			toast.success('Successfully updated user details');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Failed to update user details');
		},
	});
};

export default useUpdateUserDetailsMutation;
