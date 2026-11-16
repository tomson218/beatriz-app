import instance from '@/api/apiConfig';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { DeleteUserResponse } from '@beatriz/shared/users';

const useDeleteUserMutation = () => {
	const deleteUser = async (id: string): Promise<DeleteUserResponse> => {
		const uri = `/users/${id}`;
		const response = await instance.delete<DeleteUserResponse>(uri);
		return response.data;
	};

	return useMutation({
		mutationFn: deleteUser,

		onSuccess: (data: DeleteUserResponse) => {
			console.log(data);
			toast.success('Pomyślnie usunięto użytkownika');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się usunąć użytkownika');
		},
	});
};

export default useDeleteUserMutation;
