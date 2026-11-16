import { Divider } from '@nextui-org/divider';
import { formattedDate, formattedTime } from '@/utils/formatting-date';
import type { ForumPostDto, UserDto } from '@beatriz/shared';
import { ASSET_BASE_URL } from '@/api/apiConfig';
import { Card, CardContent, CardHeader } from '@/components/UI/card';

type PostUser = Pick<UserDto, '_id' | 'email' | 'photo' | 'username'>;

interface PostProps {
	post: ForumPostDto & { user: PostUser };
	isMyPost?: boolean;
}

const PostCard = ({ post, isMyPost }: PostProps) => {
	const postDate = `${formattedDate(new Date(post.date))} ${formattedTime(new Date(post.date))}`;
	const userAvatar = post.user.photo
		? `${ASSET_BASE_URL}/images/users/${post.user.photo}`
		: `${ASSET_BASE_URL}/images/users/defaultUser.jpg`;

	return (
		<Card
			key={post._id}
			className='m-4 max-w-2xl rounded-2xl border border-border bg-white shadow-lg'
			style={{
				margin: isMyPost ? '1rem 2rem 1rem auto' : '1rem auto 1rem 2rem',
				borderLeft: isMyPost ? '5px solid orange' : '5px solid black',
				alignSelf: isMyPost ? 'flex-end' : 'flex-start',
			}}>
			<CardHeader className='flex items-center gap-4 pb-3'>
				<img
					src={userAvatar}
					alt={`${post.user.username ?? post.user.email} avatar`}
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
