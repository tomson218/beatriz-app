import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '../apiConfig';

const useAddPostToForumMutation = refetch => {
	const addPostToForum = async postDetails => {
		const uri = `/forum`;
		const response = await instance.post(uri, postDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: addPostToForum,
		onSuccess: data => {
			refetch();
			toast.success('Pomyślnie dodano post na forum');
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Nie udało się dodać posta na forum');
		},
	});
};

export default useAddPostToForumMutation;
