import useGetUserByIdQuery from '../../api/queries/useGetUserByIdQuery';
import Loader from '../../components/libs/Loader';
import classes from './UserProfile.module.css';

import { Button } from '@/components/ui/button';
import { getItemLocalStorage } from '@/utils/localStorage';

const UserProfile = () => {
	const userId: string | null = getItemLocalStorage('user-id');

	const { data: userDetails, isLoading: isUserLoading } = useGetUserByIdQuery(userId ?? '');

	if (isUserLoading) {
		<Loader />;
	}

	return (
		<div style={{ minHeight: '94.4dvh', backgroundColor: 'white', padding: '1rem 2rem' }}>
			<img
				src={`http://localhost:3000/images/users/${userDetails?.photo}`}
				alt='User Profile'
				className={classes['user-photo']}
			/>
			<ul className='list'>
				<li className={classes['list-item']}>Username: {userDetails?.username}</li>
				<li className={classes['list-item']}>First Name: {userDetails?.firstName}</li>
				<li className={classes['list-item']}>Last Name: {userDetails?.lastName}</li>
				<li className={classes['list-item']}>Email: {userDetails?.email}</li>
			</ul>
			<Button className={classes.buttons}>Edit</Button>
			<Button className={classes.buttons}>Delete</Button>

			<br></br>
		</div>
	);
};

export default UserProfile;
