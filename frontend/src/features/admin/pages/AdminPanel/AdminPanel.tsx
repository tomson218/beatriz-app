import { Button } from '@/shared/components/ui/Button/Button';
import Users from '@/features/users/components/Users/Users';
import AddEvent from '@/features/events/components/AddEvent/AddEvent';
import { useState } from 'react';
import AddDiscountCode from '@/features/discountCodes/components/AddDiscountCode/AddDiscountCode';
import PendingOrders from '@/features/orders/components/PendingOrders/PendingOrders';
import classes from './AdminPanel.module.css';

type AdminPanelTab = 'addEvent' | 'users' | 'addDiscountCode' | 'pendingOrders';

const AdminPanel = () => {
	const [activateButton, setActivateButton] = useState<AdminPanelTab>('addEvent');

	const handleToggleButton = (id: AdminPanelTab) => {
		setActivateButton(id);
	};

	const isUsersTabActive = activateButton === 'users';
	const isAddEventTabActive = activateButton === 'addEvent';
	const isAddDiscountCodeTabActive = activateButton === 'addDiscountCode';
	const isPendingOrdersTabActive = activateButton === 'pendingOrders';

	return (
		<main>
			<nav className={classes['btn-group']}>
				<Button onClick={() => handleToggleButton('users')}>Użytkownicy</Button>
				<Button onClick={() => handleToggleButton('addEvent')}>Dodaj wydarzenie</Button>
				<Button onClick={() => handleToggleButton('addDiscountCode')}>Dodaj nowy kod rabatowy</Button>
				<Button onClick={() => handleToggleButton('pendingOrders')}>Wpłaty offline</Button>
			</nav>

			{isUsersTabActive && <Users />}
			{isAddEventTabActive && <AddEvent />}
			{isAddDiscountCodeTabActive && <AddDiscountCode />}
			{isPendingOrdersTabActive && <PendingOrders />}
		</main>
	);
};

export default AdminPanel;
