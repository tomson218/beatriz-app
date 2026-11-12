import instance from '../apiConfig';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { User } from '../../interfaces/User';

interface useEditUserMutationProps {
	id: string;
	updatedUser: User;
}

const useEditUserMutation = () => {
	const editUser = async ({ id, updatedUser }: useEditUserMutationProps) => {
		const uri = `/users/editUser/${id}`;

		const response = await instance.patch(uri, updatedUser);

		return response.data;
	};

	return useMutation({
		mutationFn: editUser,

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

export default useEditUserMutation;
