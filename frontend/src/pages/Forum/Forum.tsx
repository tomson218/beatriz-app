import { useParams } from 'react-router-dom';
import useGetPostsByEventIdQuery from '@/api/queries/useGetPostsByEventIdQuery';
import useGetEventByIdQuery from '@/api/queries/useGetEventByIdQuery';
import Post from '@/components/PostCard/PostCard';
import { useState, useRef } from 'react';
import useAddPostToForumMutation from '@/api/mutations/useAddPostToForumMutation';
import { Button } from '@/components/ui/Button/Button';
import classes from './Forum.module.css';
import { isEmptyMessage } from '@/utils/sector';
import { hasNoForumPosts, isPostAuthor } from '@/utils/forum';

const Forum = () => {
	const { eventId } = useParams();

	const { data: forumPosts, isLoading: isForumPostsLoading, refetch } = useGetPostsByEventIdQuery(eventId);
	const { data: eventDetails, isLoading: isEventDetailsLoading } = useGetEventByIdQuery(eventId);

	const [isShown, setIsShown] = useState<boolean>(false);

	const [error, setError] = useState<boolean>(false);

	const { mutate: addPost } = useAddPostToForumMutation(refetch);

 	const postRef = useRef<HTMLTextAreaElement>(null);

	const handleClickNewPost = () => {
		const message = postRef.current?.value;

		if (isEmptyMessage(message)) {
			setError(true);
			return;
		}

		setIsShown(false);
		addPost({ message, eventId });
	};

	const handleShowForm = () => {
		setIsShown(prevState => !prevState);
		setError(false);
	};

	if (isForumPostsLoading || isEventDetailsLoading) {
		return <p>Ładowanie...</p>;
	}

	return (
		<main className={classes['forum-page']}>
			<h2 className={classes['forum-title']}>
				Opinie dla {eventDetails.name}
			</h2>

			{hasNoForumPosts(forumPosts) && <p>Brak postów dla tego wydarzenia!</p>}

			{!hasNoForumPosts(forumPosts) && (
				<section className={classes['forum-posts']}>
					{forumPosts.map(forumPost => (
						<Post
							post={forumPost}
							key={forumPost._id}
							isAuthorPost={isPostAuthor(forumPost.user._id)}
						/>
					))}
				</section>
			)}

 			<aside className={classes.toggle}>
 			{!isShown && (
 				<Button onClick={handleShowForm}>
 					Dodaj nowy post
 				</Button>
 			)}

 			{isShown && (
 				<section className={classes.wrapper}>
 					<textarea
 						ref={postRef}
 						rows='4'
 						cols='30'
 						placeholder='Wpisz swoją wiadomość...'
 						className={classes['textarea-box']}
 					/>

 					<section className={classes.buttons}>
 						<Button
 							onClick={handleClickNewPost}>
 							Dodaj
 						</Button>
 						<Button
 							variant='secondary'
 							onClick={() => setIsShown(false)}>
 							Anuluj
 						</Button>
 					</section>
 					{error && <p className={classes['error-info']}>Twoja wiadomość jest pusta!!!</p>}
 				</section>
 			)}
 		</aside>
		</main>
	);
};

export default Forum;
