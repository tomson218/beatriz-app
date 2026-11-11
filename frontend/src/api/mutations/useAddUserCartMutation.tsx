import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import instance from '../apiConfig';

const useAddUserCartMutation = () => {
	const addUserCart = async cart => {
		const uri = `/users/addCart`;
		const response = await instance.post(uri, { cart });
		return response.data;
	};

	return useMutation({
		mutationFn: addUserCart,
		onSuccess: data => {
			console.log(data);
			toast.success('Pomyślnie dodano do koszyka');
		},

		onError: error => {
			console.log(`${error}`);
			toast.error('Nie udało się dodać do koszyka');
		},
	});
};

export default useAddUserCartMutation;
