import { Divider } from '@nextui-org/divider';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import type { ForumPostDto } from '@beatriz/shared/forums';
import type { UserDto } from '@beatriz/shared/users';
import { ASSET_BASE_URL } from '@/shared/api/apiConfig';
import { Card, CardContent, CardHeader } from '@/shared/components/ui/Card/Card';
import classes from './PostCard.module.css';

type PostUser = Pick<UserDto, '_id' | 'email' | 'photo' | 'username'>;

type PostWithUser = Omit<ForumPostDto, 'user'> & { user: PostUser };

interface PostProps {
	post: PostWithUser;
	isAuthorPost?: boolean;
}

const PostCard = ({ post, isAuthorPost }: PostProps) => {
	const postDate = `${formattedDate(new Date(post.date))} ${formattedTime(new Date(post.date))}`;
	const userAvatar = post.user.photo
		? `${ASSET_BASE_URL}/images/users/${post.user.photo}`
		: `${ASSET_BASE_URL}/images/users/defaultUser.jpg`;
	const avatarAlt = `${post.user.username ?? post.user.email} avatar`;

	return (
		<Card
			key={post._id}
			className={`${classes.card} ${isAuthorPost ? classes['card--my'] : classes['card--other']}`}>
			<CardHeader className='flex items-center gap-4 pb-3'>
				<img
					src={userAvatar}
					alt={avatarAlt}
					className={classes.avatar}
				/>

				<div className={classes.author}>
					<h2 className={classes['author-email']}>{post.user.email}</h2>
					<time className={classes['post-date']}>{postDate}</time>
				</div>
			</CardHeader>

			<Divider />

			<CardContent className='pt-4'>
				<p className={classes.message}>{post.message}</p>
			</CardContent>
		</Card>
	);
};

export default PostCard;
