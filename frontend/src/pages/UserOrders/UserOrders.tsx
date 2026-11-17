import { getItemLocalStorage } from '@/utils/localStorage';
import useGetUserOrdersQuery from '@/api/queries/useGetUserOrdersQuery';
import Loader from '@/components/libs/Loader/Loader';
import { formattedDate, formattedTime } from '@/utils/formatting-date';
import classes from './UserOrders.module.css';
import { getNameBlock } from '@/utils/namingTicket';
import { Button } from '@/components/ui/Button/Button';
import { useState } from 'react';
import { getNameTypeTicket } from '@/utils/namingTicket';
import type { Order } from '@beatriz/shared/orders';

interface OrderCardProps {
	order: Order;
	date: string;
}

const OrderCard = ({ order, date }: OrderCardProps) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const handleShowTickets = () => {
		setIsExpanded(!isExpanded);
	};

	return (
		<article key={order._id} className={classes.order}>
			<h3>Identyfikator zamówienia: {order._id}</h3>
			<p>
				Łączna cena: {order.totalAmount} {order.currency}
			</p>
			<p>Data zamówienia: {date}</p>

			{order.tickets.length === 0 && <p>Brak biletów dla tego zamówienia.</p>}

			<Button onClick={handleShowTickets}>{isExpanded ? 'Ukryj' : 'Wyświetl'} bilety</Button>

			{isExpanded && (
				<section className={classes.tickets}>
					{order.tickets.map((ticket, ticketIndex) => {
						const seating = ticket.seating[0];

						const sector = seating[0];
						const block = getNameBlock(seating[1]);
						const seat = seating.slice(2);
						const ticketType = getNameTypeTicket(ticket.type);

						return (
							<section key={ticketIndex} className={classes.ticket}>
								<p>Nazwa wydarzenia: {ticket.eventId.name}</p>
								<p>
									Sektor: {sector}, Strefa: {block}, {seat ? `Miejsce: ${seat}` : ''}
								</p>
								<p>Cena: {ticket.price} PLN</p>
								<p>Typ biletu: {ticketType}</p>
							</section>
						);
					})}
				</section>
			)}
		</article>
	);
};

const UserOrders = () => {
	const userId = getItemLocalStorage('user-id');

	const { data: userOrders, isLoading: isUserOrdersLoading } = useGetUserOrdersQuery(userId);

	if (isUserOrdersLoading) {
		return <Loader />;
	}

	return (
		<main className={classes['orders-container']}>
			<h1 className={classes.heading}>Historia zamówień</h1>

			{userOrders &&
				userOrders.map(order => {
					const date = `${formattedDate(new Date(order.date))} ${formattedTime(new Date(order.date))}`;

					return <OrderCard order={order} date={date} />;
				})}
		</main>
	);
};

export default UserOrders;
