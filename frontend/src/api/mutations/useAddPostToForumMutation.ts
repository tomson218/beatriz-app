import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '@/api/apiConfig';
import type { AddNewPostToForumRequest } from '@beatriz/shared/forums';
import type { SuccessItem } from '@beatriz/shared/common';
import type { ForumPostDto } from '@beatriz/shared/forums';

const useAddPostToForumMutation = (refetch: () => void) => {
	const addPostToForum = async (postDetails: AddNewPostToForumRequest): Promise<SuccessItem<ForumPostDto>> => {
		const uri = '/forum';
		const response = await instance.post<SuccessItem<ForumPostDto>>(uri, postDetails);
		return response.data;
	};

	return useMutation({
		mutationFn: addPostToForum,
		onSuccess: (data: SuccessItem<ForumPostDto>) => {
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
