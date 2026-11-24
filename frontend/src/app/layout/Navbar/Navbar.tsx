import useLogoutUserMutation from '@/features/auth/api/mutations/useLogoutUserMutation';
import { Link } from 'react-router-dom';
import classes from './Navbar.module.css';
import useGetUserByIdQuery from '@/features/users/api/queries/useGetUserByIdQuery';
import { Button } from '@/shared/components/ui/Button/Button';
import { Label } from '@/shared/components/ui/Label/Label';
import { getItemLocalStorage } from '@/shared/utils/localStorage';

const Navbar = () => {
	const userId = getItemLocalStorage<string>('user-id');

	const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserByIdQuery(userId);
	const { mutate: logout } = useLogoutUserMutation();
	const token = getItemLocalStorage<string>('token');

	const isAdmin = userDetails?.role === 'admin';

	const handleLogout = () => {
		logout();
	};

	if (isUserDetailsLoading) {
		return <div>Ładowanie...</div>;
	}

	return (
		<section className={classes['top-nav']}>
			<span className={classes.logo}>Beatriz App</span>
			<input id='menu-toggle' className={classes['menu-toggle']} type='checkbox' />
			<Label className={classes['menu-button-container']} htmlFor='menu-toggle'>
				<div className={classes['menu-button']}></div>
			</Label>

			<ul className={classes.menu}>
				<Link to='/home'>
					<li>Strona główna</li>
				</Link>
				<Link to='/favourite'>
					<li>Ulubione</li>
				</Link>
				<Link to='/tickets'>
					<li>Bilety</li>
				</Link>
				<Link to='/user-orders'>
					<li>Zamówienia</li>
				</Link>
				<Link to='/user-profile'>
					<li>Profil</li>
				</Link>

				{isAdmin && (
					<Link to='/admin-panel'>
						<li>Panel admina</li>
					</Link>
				)}
				<Link to='/'>
					{token && (
						<Button variant='ghost' className={classes.logout} onClick={handleLogout}>
							Wyloguj się
						</Button>
					)}
				</Link>
			</ul>
		</section>
	);
};

export default Navbar;
