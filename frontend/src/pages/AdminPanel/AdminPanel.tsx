import { Button } from '@/components/ui/button';
import Users from '../../components/Users/Users';
import AddEvent from '../../components/AddEvent/AddEvent';
import { useState } from 'react';
import AddDiscountCode from '../../components/AddDiscountCode/AddDiscountCode';
import classes from './AdminPanel.module.css';

const AdminPanel = () => {
	const [activateButton, setActivateButton] = useState('addEvent');

	const handleToggleButton = (id: string) => {
		setActivateButton(id);
	};

	return (
		<div className={classes.container}>
			<div className={classes['btn-group']}>
				<Button onClick={() => handleToggleButton('users')}>Użytkownicy</Button>
				<Button onClick={() => handleToggleButton('addEvent')}>Dodaj wydarzenie</Button>
				<Button onClick={() => handleToggleButton('addDiscountCode')}>Dodaj nowy kod rabatowy</Button>
			</div>

			{activateButton === 'users' && <Users />}
			{activateButton === 'addEvent' && <AddEvent />}
			{activateButton === 'addDiscountCode' && <AddDiscountCode />}
		</div>
	);
};

export default AdminPanel;
