import { useMutation } from '@tanstack/react-query';
import type { GetUserResponse as UserResponse, UpdateUserRequest } from '@beatriz/shared/users';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';

const useUpdateUserDetailsMutation = () => {
	const updateUserDetails = async (updatedUser: UpdateUserRequest): Promise<UserResponse> => {
		const uri = '/users/updateMe';
		const response = await instance.patch<UserResponse>(uri, updatedUser);
		return response.data;
	};

	return useMutation({
		mutationFn: updateUserDetails,

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

export default useUpdateUserDetailsMutation;
