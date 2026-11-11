import { useParams } from 'react-router-dom';
import useGetPostsByEventIdQuery from '@/api/queries/useGetPostsByEventIdQuery';
import useGetEventByIdQuery from '@/api/queries/useGetEventByIdQuery';
import Post from '../../components/PostCard/PostCard';
import { useState, useRef } from 'react';
import useAddPostToForumMutation from '@/api/mutations/useAddPostToForumMutation';
import { Button } from '@/components/ui/button';
import classes from './Forum.module.css';

const Forum = () => {
	const { eventId } = useParams();

	const { data: forumPosts, isLoading: isForumPostsLoading, refetch } = useGetPostsByEventIdQuery(eventId);
	const { data: eventDetails, isLoading: isEventDetailsLoading } = useGetEventByIdQuery(eventId);

	const [isShown, setIsShown] = useState(false);

	const [error, setError] = useState(false);

	const { mutate: addPost } = useAddPostToForumMutation(refetch);

	const postRef = useRef('');

	const handleClickNewPost = () => {
		const message = postRef.current?.value;

		if (message.trim() === '') {
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
		return <p>Loading...</p>;
	}

	return (
		<div style={{ backgroundColor: 'white', minHeight: '94.4dvh' }}>
			<h2
				style={{
					textAlign: 'center',
					padding: '2rem 0',
					color: '#ffa500',
					fontSize: '2rem',
					textTransform: 'uppercase',
					letterSpacing: '1px',
				}}>
				Opinie dla {eventDetails.name}
			</h2>

			{forumPosts.length === 0 && <p>Brak postów dla tego wydarzenia!</p>}

			{forumPosts.length !== 0 && (
				<section style={{ display: 'flex', flexDirection: 'column' }}>
					{forumPosts.map(forumPost => (
						<Post
							post={forumPost}
							key={forumPost._id}
							isMyPost={forumPost.user._id === JSON.parse(localStorage.getItem('user-id'))}
						/>
					))}
				</section>
			)}

			<div className={classes.toggle}>
				{!isShown && (
					<Button className={classes['toggle-btn']} onClick={handleShowForm}>
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
								className={classes['add-btn']}
								style={{
									backgroundColor: '#28a745',
									color: '#fff',
									borderRadius: '0.5rem',
									flex: 1,
									padding: '1rem',
									fontSize: '1rem',
									border: 'none',
									cursor: 'pointer',
								}}
								onClick={handleClickNewPost}>
								Dodaj
							</Button>
							<Button
								className={classes['cancel-btn']}
								style={{
									backgroundColor: '#dc3545',
									color: '#fff',
									borderRadius: '0.5rem',
									flex: 1,
									padding: '1rem',
									fontSize: '1rem',
									border: 'none',
									cursor: 'pointer',
								}}
								onClick={() => setIsShown(false)}>
								Anuluj
							</Button>
						</section>
						{error && <p className={classes['error-info']}>Twoja wiadomość jest pusta!!!</p>}
					</section>
				)}
			</div>
		</div>
	);
};

export default Forum;
