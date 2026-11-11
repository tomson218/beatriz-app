import instance from '../apiConfig';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const useDeleteUserMutation = () => {
	const deleteUser = async (id: string) => {
		const uri = `/users/${id}`;
		const response = await instance.delete(uri);
		return response.data;
	};

	return useMutation({
		mutationFn: deleteUser,

		onSuccess: data => {
			console.log(data);
			toast.success('Pomyślnie usunięto użytkownika');
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Nie udało się usunąć użytkownika');
		},
	});
};

export default useDeleteUserMutation;
