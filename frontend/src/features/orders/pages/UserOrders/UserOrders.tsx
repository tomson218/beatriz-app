import { getItemLocalStorage } from '@/shared/utils/localStorage';
import useGetUserOrdersQuery from '@/features/orders/api/queries/useGetUserOrdersQuery';
import Loader from '@/shared/components/libs/Loader/Loader';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import classes from './UserOrders.module.css';
import { getNameBlock } from '@/features/tickets/utils/namingTicket';
import { ORDER_STATUS_LABELS } from '@/features/orders/utils/orderStatus';
import { Button } from '@/shared/components/ui/Button/Button';
import { useState } from 'react';
import { getNameTypeTicket } from '@/features/tickets/utils/namingTicket';
import type { OrderDto } from '@beatriz/shared/orders';
import type { BlockType } from '@beatriz/shared/tickets';

interface OrderCardProps {
	order: OrderDto;
	date: string;
}

const OrderCard = ({ order, date }: OrderCardProps) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const handleShowTickets = () => {
		setIsExpanded(!isExpanded);
	};

	const hasNoTickets = order.tickets.length === 0;

	return (
		<article key={order._id} className={classes.order}>
			<h3>Identyfikator zamówienia: {order._id}</h3>
			<p>
				Łączna cena: {order.totalAmount} {order.currency}
			</p>
			<p>Data zamówienia: {date}</p>
			<p>Status: {ORDER_STATUS_LABELS[order.status]}</p>
			{order.expiresAt && (
				<p>
					Termin wpłaty: {formattedDate(new Date(order.expiresAt))} {formattedTime(new Date(order.expiresAt))}
				</p>
			)}

			{hasNoTickets && <p>Brak biletów dla tego zamówienia.</p>}

			<Button onClick={handleShowTickets}>{isExpanded ? 'Ukryj' : 'Wyświetl'} bilety</Button>

			{isExpanded && (
				<section className={classes.tickets}>
					{order.tickets.map((ticket, ticketIndex) => {
						const seating = ticket.seating[0];

						const sector = seating?.sector;
						const block = getNameBlock(seating?.block as BlockType);
						const seat = seating?.seat;
						const ticketType = getNameTypeTicket(String(ticket.type));

						return (
							<section key={ticketIndex} className={classes.ticket}>
								<p>Nazwa wydarzenia: {ticket.event?.name}</p>
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
				userOrders.map((order: OrderDto) => {
					const date = `${formattedDate(new Date(order.date))} ${formattedTime(new Date(order.date))}`;

					return <OrderCard key={order._id} order={order} date={date} />;
				})}
		</main>
	);
};

export default UserOrders;
