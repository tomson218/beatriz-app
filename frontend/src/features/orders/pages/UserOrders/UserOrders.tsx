import { getItemLocalStorage } from '@/shared/utils/localStorage';
import useGetUserOrdersQuery from '@/features/orders/api/queries/useGetUserOrdersQuery';
import Loader from '@/shared/components/libs/Loader/Loader';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import classes from './UserOrders.module.css';
import { getNameBlock } from '@/features/tickets/utils/namingTicket';
import { ORDER_STATUS_LABELS } from '@/features/orders/utils/orderStatus';
import { Button } from '@/shared/components/ui/Button/Button';
import { useEffect, useState } from 'react';
import { getNameTypeTicket } from '@/features/tickets/utils/namingTicket';
import type { OrderDto } from '@beatriz/shared/orders';
import type { BlockType } from '@beatriz/shared/tickets';

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

const formatRemainingTime = (ms: number): string => {
	const days = Math.floor(ms / DAY);
	const hours = Math.floor((ms % DAY) / HOUR);
	const minutes = Math.floor((ms % HOUR) / MINUTE);
	const seconds = Math.floor((ms % MINUTE) / SECOND);

	const pad = (value: number) => String(value).padStart(2, '0');
	const time = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;

	return days > 0 ? `${days} d ${time}` : time;
};

const Countdown = ({ expiresAt }: { expiresAt: string | Date }) => {
	const [now, setNow] = useState<number>(() => Date.now());

	useEffect(() => {
		const intervalId = setInterval(() => setNow(Date.now()), SECOND);
		return () => clearInterval(intervalId);
	}, []);

	const remaining = new Date(expiresAt).getTime() - now;

	if (remaining <= 0) {
		return <span className={classes['countdown-expired']}>Termin minął</span>;
	}

	return (
		<span className={remaining < HOUR ? classes['countdown-urgent'] : classes.countdown}>
			zostało {formatRemainingTime(remaining)}
		</span>
	);
};

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
		<article className={classes.order}>
			<header className={classes['order-header']}>
				<h3 className={classes['order-id']}>Zamówienie nr {order._id}</h3>
				<span className={`${classes.status} ${classes[`status-${order.status}`] ?? ''}`}>
					{ORDER_STATUS_LABELS[order.status]}
				</span>
			</header>

			<dl className={classes.details}>
				<div>
					<dt>Łączna cena</dt>
					<dd>
						{order.totalAmount} {order.currency}
					</dd>
				</div>
				<div>
					<dt>Data zamówienia</dt>
					<dd>{date}</dd>
				</div>
				{order.expiresAt && (
					<div>
						<dt>Termin wpłaty</dt>
						<dd>
							{formattedDate(new Date(order.expiresAt))} {formattedTime(new Date(order.expiresAt))}
							{order.status === 'pending' && (
								<>
									<br />
									<Countdown expiresAt={order.expiresAt} />
								</>
							)}
						</dd>
					</div>
				)}
			</dl>

			{hasNoTickets && <p className={classes.muted}>Brak biletów dla tego zamówienia.</p>}

			<Button className={classes['toggle-button']} onClick={handleShowTickets}>
				{isExpanded ? 'Ukryj' : 'Wyświetl'} bilety
			</Button>

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
								<h4 className={classes['ticket-name']}>{ticket.event?.name}</h4>
								<p>
									Sektor: {sector}, Strefa: {block}
									{seat ? `, Miejsce: ${seat}` : ''}
								</p>
								<p>Typ biletu: {ticketType}</p>
								<p className={classes['ticket-price']}>{ticket.price} PLN</p>
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

			{(!userOrders || userOrders.length === 0) && (
				<p className={classes.empty}>Nie masz jeszcze żadnych zamówień.</p>
			)}

			{userOrders &&
				userOrders.map((order: OrderDto) => {
					const date = `${formattedDate(new Date(order.date))} ${formattedTime(new Date(order.date))}`;

					return <OrderCard key={order._id} order={order} date={date} />;
				})}
		</main>
	);
};

export default UserOrders;
