import { useContext } from 'react';
import useCreateCheckoutSessionMutation from '../../api/mutations/useCreateCheckoutSessionMutation';
import { Button } from '@/components/ui/button';
import classes from './OrderSummary.module.css';
import Order from '../../components/Order/Order';
import useAddUserCartMutation from '@/api/mutations/useAddUserCartMutation';
import useGetEventByIdQuery from '@/api/queries/useGetEventByIdQuery';
import DiscountCodeForm from '../../components/DiscountCodeForm/DiscountCodeForm';
import OrderContext from '@/context/OrderContext';
import TotalAmount from '../../components/TotalAmount/TotalAmount';

const OrderSummary = () => {
	const params = Object.fromEntries(new URLSearchParams(window.location.search));
	const { eventId } = params;

	const { order } = useContext(OrderContext);

	const { data: eventDetails, loading: isEventDetailsLoading } = useGetEventByIdQuery(eventId);

	const { mutate: createCheckoutSession } = useCreateCheckoutSessionMutation();

	const { mutate: addCart } = useAddUserCartMutation();

	const sendData = () => {
		createCheckoutSession(order);
	};

	if (isEventDetailsLoading) {
		return <p>Loading...</p>;
	}

	return (
		<div style={{ minHeight: '94.4dvh', backgroundColor: '#f5f5dc' }}>
			<h2 className={classes.title}>Podsumowanie Zamówienia</h2>
			<section className={classes['grid-container']}>
				{order.map((orderItem, index) => (
					<Order
						key={`${orderItem.seating || 'no-seat'}-${orderItem.price}`}
						obj={{
							eventId: orderItem.eventId,
							sector: orderItem.sector,
							seat: orderItem.seating,
							block: orderItem.block,
						}}
						eventDetails={eventDetails}
						price={orderItem.price}
						onChangePrice={null}
						type={orderItem.type}
						isSummary
					/>
				))}
			</section>

			<DiscountCodeForm />

			<TotalAmount />

			<section className={classes.buttons}>
				<Button className={classes.button} onClick={sendData}>
					Zapłać teraz
				</Button>
			</section>
		</div>
	);
};

export default OrderSummary;
