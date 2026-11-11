import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import useAddPostToForumMutation from '@/api/mutations/useAddPostToForumMutation';

interface AddPostProps {
	refetch: () => void;
}

const AddPost = (refetch: AddPostProps) => {
	const [isShown, setIsShown] = useState(false);

	const { mutate: addPost } = useAddPostToForumMutation(refetch);

	const postRef = useRef('');

	const handleClickNewPost = () => {
		setIsShown(false);

		addPost(postRef.current?.value);
	};

	const handleShowForm = () => {
		setIsShown(prevState => !prevState);
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'flex-end',
				marginRight: '2rem',
				alignItems: 'center',
				gap: '1rem',
				marginTop: '5rem',
			}}>
			{!isShown && (
				<Button style={{ padding: '1.5rem 3rem', borderRadius: '1rem' }} onClick={handleShowForm}>
					Dodaj nowy post
				</Button>
			)}
			{isShown && (
				<>
					<textarea ref={postRef} rows='5' cols='33' style={{ borderRadius: '1rem' }} />
					<Button style={{ padding: '1.5rem 3rem', borderRadius: '1rem' }} onClick={handleClickNewPost}>
						Dodaj
					</Button>
				</>
			)}
		</div>
	);
};

export default AddPost;
