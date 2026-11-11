import { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCreateCheckoutSessionMutation from '../../api/mutations/useCreateCheckoutSessionMutation';
import useGetEventByIdQuery from '../../api/queries/useGetEventByIdQuery';
import { Button } from '@/components/ui/button';
import classes from './TicketChoice.module.css';
import Order from '../../components/Order/Order';
import useAddUserCartMutation from '@/api/mutations/useAddUserCartMutation';
import OrderContext from '@/context/OrderContext';
import OrderWithOutSeats from '../../components/OrderWithoutSeats/OrderWithoutSeats';
import TotalAmount from '../../components/TotalAmount/TotalAmount';
import Modal from '../../components/UI/Modal/Modal';

const getTicketTypeByPrice = (object, value) => {
	return Object.keys(object).find(key => object[key] === value);
};

const TicketChoice = () => {
	const params = Object.fromEntries(new URLSearchParams(window.location.search));
	const { eventId, sector, seats, block } = params;

	const [isError, setIsError] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const handleIsErrorChange = error => {
		setIsError(error);
	};

	const { setTotalPrice } = useContext(OrderContext);

	const { order, setOrder } = useContext(OrderContext);

	const { mutate: createCheckoutSession } = useCreateCheckoutSessionMutation();

	const {
		data: eventDetails,
		loading: isEventDetailsLoading,
		error: eventDetailsError,
	} = useGetEventByIdQuery(eventId);
	const { mutate: addCart } = useAddUserCartMutation();

	const [ticketsPrice, setTicketsPrice] = useState({});

	const hasSeats = seats && seats.trim() !== '';

	const location = useLocation();
	const currentUrl = `${location.pathname}${location.search}`;

	const seatsArray = useMemo(() => {
		return hasSeats ? seats.split(',') : ['no-seat'];
	}, [seats]);

	useEffect(() => {
		if (eventDetails) {
			const prices = eventDetails.prices || {};
			const pricesObj = seatsArray.reduce((acc, seat) => {
				acc[seat] = prices.normal;
				return acc;
			}, {});
			setTicketsPrice(pricesObj);
		}
	}, [eventDetails, seatsArray]);

	useEffect(() => {
		if (eventDetails) {
			setOrder(prevOrder => {
				const newOrder = seatsArray.map(seat => ({
					eventId,
					sector,
					block,
					name: eventDetails.name,
					date: eventDetails.date,
					images: [`http://localhost:3000/images/events/${eventDetails.image}`],
					seating: seat !== 'no-seat' ? seat : undefined,
					price: ticketsPrice[seat],
					type: getTicketTypeByPrice(eventDetails.prices, ticketsPrice[seat]),
				}));

				localStorage.setItem('ORDERS', JSON.stringify(newOrder));

				return newOrder;
			});
		}
	}, [eventDetails, ticketsPrice, seatsArray, eventId, sector]);

	useEffect(() => {
		const totalAmount = hasSeats ? order.reduce((sum, item) => sum + item?.price, 0) : ticketsPrice['no-seat'] || 0;

		setTotalPrice(totalAmount);
		localStorage.setItem('totalPrice', JSON.stringify(totalAmount));
	}, [order, ticketsPrice, hasSeats, setTotalPrice]);

	const handleChangePrice = (e, seat) => {
		const price = parseFloat(e.target.value);

		const ticketType = getTicketTypeByPrice(eventDetails.prices, price);

		setTicketsPrice(prevPrices => ({
			...prevPrices,
			[seat]: price,
		}));
		setOrder(prevOrder => {
			return prevOrder.map(item => {
				if (item?.seating === seat || (!item?.seating && seat === 'no-seat')) {
					return {
						...item,
						price: price,
						type: ticketType,
					};
				}
				return item;
			});
		});
	};

	const sendData = () => {
		createCheckoutSession(order);
	};

	const saveOrder = () => {
		localStorage.setItem('order', JSON.stringify(order));
		addCart(order);
	};

	if (isEventDetailsLoading) {
		return <p>Loading...</p>;
	}

	if (eventDetailsError) {
		return <p>Error loading event details.</p>;
	}

	return (
		<div style={{ minHeight: '94.4dvh', backgroundColor: '#f5f5dc' }}>
			<h2
				style={{
					fontWeight: 600,
					textTransform: 'uppercase',
					letterSpacing: '1px',
					fontSize: '2rem',
					padding: '2rem .5rem',
				}}>
				Wybór typu biletów
			</h2>
			<div className={classes['grid-container']}>
				{seats !== undefined &&
					order.map((orderItem, index) => (
						<Order
							key={`${orderItem.seating || 'no-seat'}-${orderItem.price}`}
							obj={{
								eventId: orderItem.eventId,
								sector: orderItem.sector,
								seat: orderItem.seating,
								block: orderItem.block,
							}}
							eventDetails={eventDetails}
							onChangePrice={e => handleChangePrice(e, orderItem.seating || 'no-seat')}
							price={orderItem?.price}
							type={orderItem?.type}
							isChoice
						/>
					))}
			</div>

			{seats === undefined && (
				<OrderWithOutSeats
					eventDetails={eventDetails}
					block={block}
					sector={sector}
					onChangeIsError={handleIsErrorChange}
				/>
			)}

			<TotalAmount />

			<div
				className={classes.buttons}
				style={{ display: 'flex', gap: '1rem', padding: '0 1rem 1rem', borderRadius: '1rem' }}>
				<Link to={!isError ? `/summary?eventId=${eventId}` : currentUrl}>
					<Button
						onClick={() => {
							if (isError) {
								setIsOpen(true);
							}
						}}>
						Przejdź do podsumowania
					</Button>
				</Link>
			</div>
			{isOpen && (
				<Modal
					title='Błąd!'
					content='Łączna liczba wybranych biletów ma być równa sumie liczby typów biletów'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
};

export default TicketChoice;
