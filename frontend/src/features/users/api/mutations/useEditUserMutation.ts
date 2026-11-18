import instance from '@/shared/api/apiConfig';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import type { GetUserResponse as UserResponse, UpdateUserRequest } from '@beatriz/shared/users';

interface UseEditUserMutationProps {
	id: string;
	updatedUser: UpdateUserRequest;
}

const useEditUserMutation = () => {
	const editUser = async ({ id, updatedUser }: UseEditUserMutationProps): Promise<UserResponse> => {
		const uri = `/users/${id}`;
		const response = await instance.patch<UserResponse>(uri, updatedUser);
		return response.data;
	};

	return useMutation({
		mutationFn: editUser,

		onSuccess: (data: UserResponse) => {
			console.log(data);
 		toast.success('Pomyślnie zaktualizowano dane użytkownika');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się zaktualizować danych użytkownika');
		},
	});
};

export default useEditUserMutation;
