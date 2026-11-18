import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { AddNewPostToForumRequest, AddNewPostToForumResponse } from '@beatriz/shared/forums';

const useAddPostToForumMutation = (refetch: () => void) => {
	const addPostToForum = async (postDetails: AddNewPostToForumRequest): Promise<AddNewPostToForumResponse> => {
		const uri = '/forum';
		const response = await instance.post<AddNewPostToForumResponse>(uri, postDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: addPostToForum,
		onSuccess: (data: AddNewPostToForumResponse) => {
			refetch();
			console.log(data);
			toast.success('Pomyślnie dodano post na forum');
		},

		onError: (error: unknown) => {
			console.log(error);
			toast.error('Nie udało się dodać posta na forum');
		},
	});
};

export default useAddPostToForumMutation;
