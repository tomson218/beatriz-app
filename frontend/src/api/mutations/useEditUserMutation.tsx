import instance from '@/api/apiConfig';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import type { UpdateUserRequest, UpdateUserResponse } from '@beatriz/shared';

interface UseEditUserMutationProps {
	id: string;
	updatedUser: UpdateUserRequest;
}

const useEditUserMutation = () => {
	const editUser = async ({ id, updatedUser }: UseEditUserMutationProps): Promise<UpdateUserResponse> => {
		const uri = `/users/editUser/${id}`;
		const response = await instance.patch<UpdateUserResponse>(uri, updatedUser);
		return response.data;
	};

	return useMutation({
		mutationFn: editUser,

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

export default useEditUserMutation;
