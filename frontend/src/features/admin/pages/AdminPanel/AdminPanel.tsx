import { Button } from '@/shared/components/ui/Button/Button';
import AddEvent from '@/features/events/components/AddEvent/AddEvent';
import { useState } from 'react';
import PendingOrders from '@/features/orders/components/PendingOrders/PendingOrders';
import classes from './AdminPanel.module.css';

type AdminPanelTab = 'addEvent' | 'pendingOrders';

const AdminPanel = () => {
	const [activateButton, setActivateButton] = useState<AdminPanelTab>('addEvent');

	const handleToggleButton = (id: AdminPanelTab) => {
		setActivateButton(id);
	};

	const isAddEventTabActive = activateButton === 'addEvent';
	const isPendingOrdersTabActive = activateButton === 'pendingOrders';

	return (
		<main>
			<nav className={classes['btn-group']}>
				<Button onClick={() => handleToggleButton('addEvent')}>Dodaj wydarzenie</Button>
				<Button onClick={() => handleToggleButton('pendingOrders')}>Wpłaty offline</Button>
			</nav>

			{isAddEventTabActive && <AddEvent />}
			{isPendingOrdersTabActive && <PendingOrders />}
		</main>
	);
};

export default AdminPanel;
