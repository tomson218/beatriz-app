import { Button } from '@/components/ui/Button/Button';
import Users from '@/components/Users/Users';
import AddEvent from '@/components/AddEvent/AddEvent';
import { useState } from 'react';
import AddDiscountCode from '@/components/AddDiscountCode/AddDiscountCode';
import classes from './AdminPanel.module.css';

type AdminPanelTab = 'addEvent' | 'users' | 'addDiscountCode';

const AdminPanel = () => {
	const [activateButton, setActivateButton] = useState<AdminPanelTab>('addEvent');

	const handleToggleButton = (id: string) => {
		setActivateButton(id);
	};

	return (
		<main className={classes.container}>
			<nav className={classes['btn-group']}>
				<Button onClick={() => handleToggleButton('users')}>Użytkownicy</Button>
				<Button onClick={() => handleToggleButton('addEvent')}>Dodaj wydarzenie</Button>
				<Button onClick={() => handleToggleButton('addDiscountCode')}>Dodaj nowy kod rabatowy</Button>
			</nav>

			{activateButton === 'users' && <Users />}
			{activateButton === 'addEvent' && <AddEvent />}
			{activateButton === 'addDiscountCode' && <AddDiscountCode />}
		</main>
	);
};

export default AdminPanel;
