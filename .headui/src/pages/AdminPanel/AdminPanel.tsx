import { Button } from '@/components/ui/Button/Button';
import Users from '@/components/Users/Users';
import AddEvent from '@/components/AddEvent/AddEvent';
import { useState } from 'react';
import AddDiscountCode from '@/components/AddDiscountCode/AddDiscountCode';
import classes from './AdminPanel.module.css';

type AdminPanelTab = 'addEvent' | 'users' | 'addDiscountCode';

const AdminPanel = () => {
	const [activateButton, setActivateButton] = useState<AdminPanelTab>('addEvent');

	const handleToggleButton = (id: AdminPanelTab) => {
		setActivateButton(id);
	};

	const isUsersTabActive = activateButton === 'users';
	const isAddEventTabActive = activateButton === 'addEvent';
	const isAddDiscountCodeTabActive = activateButton === 'addDiscountCode';

	return (
		<main>
			<nav className={classes['btn-group']}>
				<Button onClick={() => handleToggleButton('users')}>Użytkownicy</Button>
				<Button onClick={() => handleToggleButton('addEvent')}>Dodaj wydarzenie</Button>
				<Button onClick={() => handleToggleButton('addDiscountCode')}>Dodaj nowy kod rabatowy</Button>
			</nav>

			{isUsersTabActive && <Users />}
			{isAddEventTabActive && <AddEvent />}
			{isAddDiscountCodeTabActive && <AddDiscountCode />}
		</main>
	);
};

export default AdminPanel;
