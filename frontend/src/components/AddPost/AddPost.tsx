import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import useAddPostToForumMutation from '@/api/mutations/useAddPostToForumMutation';
import classes from './AddPost.module.css';

interface AddPostProps {
	refetch: () => void;
}

const AddPost = ({ refetch }: AddPostProps) => {
	const [isShown, setIsShown] = useState<boolean>(false);

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
		<section className={classes.container}>
			{!isShown && (
				<Button className={classes.button} onClick={handleShowForm}>
					Dodaj nowy post
				</Button>
			)}
			{isShown && (
				<article>
					<textarea ref={postRef} rows='5' cols='33' className={classes.textarea} />
					<Button className={classes.button} onClick={handleClickNewPost}>
						Dodaj
					</Button>
				</article>
			)}
		</section>
	);
};

export default AddPost;
