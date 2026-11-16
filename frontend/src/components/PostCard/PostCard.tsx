import { Divider } from '@nextui-org/divider';
import { formattedDate, formattedTime } from '@/utils/formatting-date';
import type { ForumPostDto } from '@beatriz/shared/forums';
import type { UserDto } from '@beatriz/shared/users';
import { ASSET_BASE_URL } from '@/api/apiConfig';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import classes from './PostCard.module.css';

type PostUser = Pick<UserDto, '_id' | 'email' | 'photo' | 'username'>;

interface PostProps {
	post: ForumPostDto & { user: PostUser };
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
					className='h-10 w-10 rounded-xl object-cover'
				/>

				<div className='flex flex-col gap-1'>
					<h2 className='text-base font-semibold'>{post.user.email}</h2>
					<time className='text-sm text-muted-foreground'>{postDate}</time>
				</div>
			</CardHeader>

			<Divider />

			<CardContent className='pt-4'>
				<p className='leading-8 text-base'>{post.message}</p>
			</CardContent>
		</Card>
	);
};

export default PostCard;
