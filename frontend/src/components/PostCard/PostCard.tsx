import { Divider } from '@nextui-org/divider';
import { formattedDate, formattedTime } from '@/utils/formatting-date';
import { Post } from '../../interfaces/Post';

interface PostProps {
	post: Post;
	isMyPost?: boolean;
}

const PostCard = ({ post, isMyPost }: PostProps) => {
	const postDate = `${formattedDate(new Date(post.date))} ${formattedTime(new Date(post.date))}`;

	return (
		<>
			<section
				key={post._id}
				style={{
					margin: '1rem 2rem',
					borderLeft: isMyPost ? '5px solid orange' : '5px solid black',
					alignSelf: isMyPost ? 'flex-end' : 'flex-start',
					backgroundColor: '#fff',
					borderRadius: '1rem',
					boxShadow: '13px 15px 18px -5px rgba(66, 68, 90, 1)',
					padding: '1rem 2rem',
					maxWidth: '40rem',
					display: 'flex',
					flexDirection: 'column',
					gap: '1.5rem',
				}}>
				<div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
					<img
						src='http://localhost:3000/images/users/defaultUser.jpg'
						alt='avatar'
						style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '1rem' }}
					/>

					<div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
						<h1>{post.user.email}</h1>
						<time>{postDate}</time>
					</div>
				</div>
				<Divider />
				<p style={{ lineHeight: 1.8 }}>{post.message}</p>
			</section>
		</>
	);
};

export default PostCard;
