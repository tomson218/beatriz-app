import instance from '@/api/apiConfig';
import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import type { GetUserResponse, UpdateUserRequest } from '@beatriz/shared/users';

interface UseEditUserMutationProps {
	id: string;
	updatedUser: UpdateUserRequest;
}

const useEditUserMutation = () => {
	const editUser = async ({ id, updatedUser }: UseEditUserMutationProps): Promise<GetUserResponse> => {
		const uri = `/users/editUser/${id}`;
		const response = await instance.patch<GetUserResponse>(uri, updatedUser);
		return response.data;
	};

	return useMutation({
		mutationFn: editUser,

		onSuccess: (data: GetUserResponse) => {
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
