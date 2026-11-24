import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import useCreateCheckoutSessionMutation from '@/features/orders/api/mutations/useCreateCheckoutSessionMutation';
import useCreateOfflineOrderMutation from '@/features/orders/api/mutations/useCreateOfflineOrderMutation';
import { Button } from '@/shared/components/ui/Button/Button';
import classes from './OrderSummary.module.css';
import { NO_SEAT } from '@/features/tickets/utils/seats';
import Order from '@/features/orders/components/Order/Order';
import useGetEventByIdQuery from '@/features/events/api/queries/useGetEventByIdQuery';
import DiscountCodeForm from '@/features/discountCodes/components/DiscountCodeForm/DiscountCodeForm';
import OrderContext, { type OrderContextType } from '@/features/orders/context/OrderContext';
import TotalAmount from '@/features/orders/components/TotalAmount/TotalAmount';

const OrderSummary = () => {
	const params = Object.fromEntries(new URLSearchParams(window.location.search));
	const { eventId } = params;

	const { order } = useContext<OrderContextType>(OrderContext);

	const { data: eventDetails, isLoading: isEventDetailsLoading } = useGetEventByIdQuery(eventId);

	const { mutate: createCheckoutSession } = useCreateCheckoutSessionMutation();

	const { mutate: createOfflineOrder, isPending: isOfflineOrderPending } = useCreateOfflineOrderMutation();

	const navigate = useNavigate();

	const sendData = () => {
		createCheckoutSession(order);
	};

	const payOffline = () => {
		createOfflineOrder(order, { onSuccess: () => navigate('/user-orders') });
	};

	if (isEventDetailsLoading) {
		return <p>Ładowanie...</p>;
	}

	return (
		<main>
			<h2 className={classes.title}>Podsumowanie Zamówienia</h2>
			<section className={classes['grid-container']}>
				{order.map(orderItem => (
					<Order
						key={`${orderItem.seating || NO_SEAT}-${orderItem.price}`}
						ticket={{
							eventId: orderItem.eventId,
							sector: orderItem.sector,
							seat: orderItem.seating,
							block: orderItem.block,
						}}
						eventDetails={eventDetails}
						price={orderItem.price}
						type={orderItem.type}
						isSummary
					/>
				))}
			</section>

			<DiscountCodeForm />

			<TotalAmount />

			<section className={classes.buttons}>
				<Button
					size='lg'
					className='bg-orange-500 text-black hover:bg-orange-600 hover:text-white'
					onClick={sendData}>
					Zapłać teraz
				</Button>
				<Button
					size='lg'
					variant='outline'
					className='border-2 border-black bg-white text-black hover:border-orange-500 hover:bg-orange-100 hover:text-black'
					disabled={isOfflineOrderPending}
					onClick={payOffline}>
					Zapłać offline
				</Button>
			</section>
		</main>
	);
};

export default OrderSummary;
