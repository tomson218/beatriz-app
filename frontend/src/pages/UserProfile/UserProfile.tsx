import useGetUserByIdQuery from '@/api/queries/useGetUserByIdQuery';
import Loader from '@/components/libs/Loader';
import classes from './UserProfile.module.css';

import { Button } from '@/components/ui/button';
import { getItemLocalStorage } from '@/utils/localStorage';
import { ASSET_BASE_URL } from '@/api/apiConfig';

const UserProfile = () => {
	const userId: string | null = getItemLocalStorage('user-id');

	const { data: userDetails, isLoading: isUserLoading } = useGetUserByIdQuery(userId ?? '');

	if (isUserLoading) {
		<Loader />;
	}

	return (
		<main className={classes['user-profile-page']}>
			<figure>
				<img
					src={`${ASSET_BASE_URL}/images/users/${userDetails?.photo}`}
					alt='User Profile'
					className={classes['user-photo']}
				/>
			</figure>
			<ul className='list'>
				<li className={classes['list-item']}>Username: {userDetails?.username}</li>
				<li className={classes['list-item']}>First Name: {userDetails?.firstName}</li>
				<li className={classes['list-item']}>Last Name: {userDetails?.lastName}</li>
				<li className={classes['list-item']}>Email: {userDetails?.email}</li>
			</ul>
			<div className={classes['button-group']}>
				<Button className={classes.buttons}>Edit</Button>
				<Button className={classes.buttons}>Delete</Button>
			</div>
		</main>
	);
};

export default UserProfile;
