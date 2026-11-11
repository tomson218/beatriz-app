import { getItemLocalStorage } from '@/utils/localStorage';
import useGetUserOrdersQuery from '../../api/queries/useGetUserOrdersQuery';
import Loader from '../../components/libs/Loader';
import { formattedDate, formattedTime } from '../../utils/formatting-date';
import classes from './UserOrders.module.css';
import { getNameBlock } from '@/utils/namingTicket';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { getNameTypeTicket } from '@/utils/namingTicket';

const UserOrders = () => {
	const userId = getItemLocalStorage('user-id');

	const { data: userOrders, isLoading: isUserOrdersLoading } = useGetUserOrdersQuery(userId);

	if (isUserOrdersLoading) {
		return <Loader />;
	}

	const OrderCard = ({ order, date }) => {
		const [isExpanded, setIsExpanded] = useState(false);

		const handleShowTickets = () => {
			setIsExpanded(!isExpanded);
		};

		return (
			<div key={order._id} className={classes.order}>
				<h3>Identyfikator zamówienia: {order._id}</h3>
				<p>
					Łączna cena: {order.totalAmount} {order.currency}
				</p>
				<p>Data zamówienia: {date}</p>

				{order.tickets.length === 0 && <p>No tickets available for this order.</p>}

				<Button onClick={handleShowTickets}>{isExpanded ? 'Ukryj' : 'Wyświetl'} bilety</Button>

				{isExpanded && (
					<div className={classes.tickets}>
						{order.tickets.map((ticket, ticketIndex) => {
							const seating = ticket.seating[0];

							const sector = seating[0];
							const block = getNameBlock(seating[1]);
							const seat = seating.slice(2);
							const ticketType = getNameTypeTicket(ticket.type);

							return (
								<div key={ticketIndex} className={classes.ticket}>
									<p>Nazwa wydarzenia: {ticket.eventId.name}</p>
									<p>
										Sektor: {sector}, Strefa: {block}, {seat ? `Miejsce: ${seat}` : ''}
									</p>
									<p>Cena: {ticket.price} PLN</p>
									<p>Typ biletu: {ticketType}</p>
								</div>
							);
						})}
					</div>
				)}
			</div>
		);
	};

	return (
		<div className={classes['orders-container']}>
			<h1 className={classes.heading}>Historia zamówień</h1>

			{userOrders &&
				userOrders.map(order => {
					const date = `${formattedDate(new Date(order.date))} ${formattedTime(new Date(order.date))}`;

					return <OrderCard order={order} date={date} />;
				})}
		</div>
	);
};

export default UserOrders;
