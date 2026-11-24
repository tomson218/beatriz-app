import useGetPendingOrdersQuery from '@/features/orders/api/queries/useGetPendingOrdersQuery';
import useUpdateOrderStatusMutation from '@/features/orders/api/mutations/useUpdateOrderStatusMutation';
import { getNameBlock, getNameTypeTicket } from '@/features/tickets/utils/namingTicket';
import Loader from '@/shared/components/libs/Loader/Loader';
import { Button } from '@/shared/components/ui/Button/Button';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import type { BlockType } from '@beatriz/shared/tickets';
import classes from './PendingOrders.module.css';

const PendingOrders = () => {
	const { data: orders, isLoading, isError } = useGetPendingOrdersQuery();
	const { mutate: updateOrderStatus, isPending } = useUpdateOrderStatusMutation();

	if (isLoading) {
		return <Loader />;
	}

	if (isError) {
		return <p className={classes.message}>Nie udało się pobrać wpłat.</p>;
	}

	if (!orders?.length) {
		return <p className={classes.message}>Brak wpłat do zatwierdzenia.</p>;
	}

	return (
		<section className={classes.orders} aria-label='Wpłaty offline do zatwierdzenia'>
			{orders.map(order => {
				const orderDate = new Date(order.date);
				const deadline = new Date(order.expiresAt ?? order.date);

				return (
					<article key={order._id} className={classes.order}>
						<h3>Zamówienie {order._id}</h3>
						<p>Kupujący: {order.user?.email}</p>
						<p>
							Data: {formattedDate(orderDate)} {formattedTime(orderDate)}
						</p>
						<p>
							Termin wpłaty: {formattedDate(deadline)} {formattedTime(deadline)}
						</p>
						<p className={classes.amount}>
							Do zapłaty: {order.totalAmount} {order.currency}
						</p>

						<ul className={classes.tickets}>
							{order.tickets.map(ticket => {
								const seating = ticket.seating[0];

								return (
									<li key={String(ticket._id)}>
										{ticket.event?.name}, sektor {seating?.sector}, strefa{' '}
										{getNameBlock(seating?.block as BlockType)}
										{seating?.seat ? `, miejsce ${seating.seat}` : ''},{' '}
										{getNameTypeTicket(String(ticket.type))}: {ticket.price} {order.currency}
									</li>
								);
							})}
						</ul>

						<footer className={classes.actions}>
							<Button
								disabled={isPending}
								onClick={() => updateOrderStatus({ orderId: order._id, status: 'paid' })}>
								Zatwierdź wpłatę
							</Button>
							<Button
								variant='destructive'
								disabled={isPending}
								onClick={() => updateOrderStatus({ orderId: order._id, status: 'rejected' })}>
								Odrzuć
							</Button>
						</footer>
					</article>
				);
			})}
		</section>
	);
};

export default PendingOrders;
