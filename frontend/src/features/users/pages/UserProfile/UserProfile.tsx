import useGetUserByIdQuery from '@/features/users/api/queries/useGetUserByIdQuery';
import Loader from '@/shared/components/libs/Loader/Loader';
import classes from './UserProfile.module.css';

import { Button } from '@/shared/components/ui/Button/Button';
import { getItemLocalStorage } from '@/shared/utils/localStorage';
import { ASSET_BASE_URL } from '@/shared/api/apiConfig';

const UserProfile = () => {
	const userId: string | null = getItemLocalStorage<string>('user-id');

	const { data: userDetails, isLoading: isUserLoading } = useGetUserByIdQuery(userId ?? '');

	if (isUserLoading) {
		return <Loader />;
	}

	return (
		<main className={classes['user-profile-page']}>
			<h1 className={classes.title}>Profil użytkownika</h1>
			<figure className={classes['user-photo-wrapper']}>
				<img
					src={`${ASSET_BASE_URL}/images/users/${userDetails?.photo}`}
					alt='Zdjęcie profilu'
					className={classes['user-photo']}
				/>
			</figure>
			<ul className={classes.list}>
				<li className={classes['list-item']}>Nazwa użytkownika: {userDetails?.username}</li>
				<li className={classes['list-item']}>Imię: {userDetails?.firstName}</li>
				<li className={classes['list-item']}>Nazwisko: {userDetails?.lastName}</li>
				<li className={classes['list-item']}>E-mail: {userDetails?.email}</li>
			</ul>
 			<nav className={classes['button-group']}>
 				<Button>Edytuj</Button>
 				<Button variant='destructive'>Usuń</Button>
 			</nav>
		</main>
	);
};

export default UserProfile;
