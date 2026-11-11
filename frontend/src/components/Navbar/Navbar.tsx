import useLogoutUserMutation from '../../api/mutations/useLogoutUserMutation';
import { Link } from 'react-router-dom';
import './Navbar.css';
import useGetUserByIdQuery from '@/api/queries/useGetUserByIdQuery';
import { Button } from '@/components/ui/button';
import { getItemLocalStorage } from '@/utils/localStorage';

const Navbar = () => {
	const userId = getItemLocalStorage('user-id');

	const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserByIdQuery(userId);
	const { mutate: logout } = useLogoutUserMutation();
	const token = getItemLocalStorage('token');

	const isAdmin = userDetails?.role === 'admin';

	const handleLogout = () => {
		logout();
	};

	if (isUserDetailsLoading) {
		return <div>Loading...</div>;
	}

	return (
		<section className='top-nav'>
			<span className='logo'>Beatriz App</span>
			<input id='menu-toggle' type='checkbox' />
			<label className='menu-button-container' htmlFor='menu-toggle'>
				<div className='menu-button'></div>
			</label>

			<ul className='menu'>
				<Link to='/home'>
					<li className='list'>Strona główna</li>
				</Link>
				<Link to='/favourite'>
					<li className='list'>Ulubione</li>
				</Link>
				<Link to='/tickets'>
					<li className='list'>Bilety</li>
				</Link>
				<Link to='/user-profile'>
					<li className='list'>Profil</li>
				</Link>

				{isAdmin && (
					<Link to='/admin-panel'>
						<li className='list'>Panel admina</li>
					</Link>
				)}
				<Link to='/'>
					{token && (
						<Button variant='ghost' className='logout' onClick={handleLogout}>
							Wyloguj się
						</Button>
					)}
				</Link>
			</ul>
		</section>
	);
};

export default Navbar;
