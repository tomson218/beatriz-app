import { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCreateCheckoutSessionMutation from '@/api/mutations/useCreateCheckoutSessionMutation';
import useGetEventByIdQuery from '@/api/queries/useGetEventByIdQuery';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import classes from './TicketChoice.module.css';
import Order from '@/components/Order/Order';
import useAddUserCartMutation from '@/api/mutations/useAddUserCartMutation';
import OrderContext, { type OrderContextType } from '@/context/OrderContext';
import OrderWithOutSeats from '@/components/OrderWithoutSeats/OrderWithoutSeats';
import TotalAmount from '@/components/TotalAmount/TotalAmount';
import type { Prices, Event } from '@beatriz/shared/events';
import type { TicketType } from '@beatriz/shared/tickets';
import type { CartTicket } from '@beatriz/shared/orders';
import { ASSET_BASE_URL } from '@/api/apiConfig';

const getTicketTypeByPrice = (prices: Prices, value: number): TicketType | undefined => {
	return Object.keys(prices).find(key => prices[key as TicketType] === value) as TicketType | undefined;
};

const TicketChoice = () => {
	const params = Object.fromEntries(new URLSearchParams(window.location.search));
	const { eventId, sector, seats, block } = params;

	const [isError, setIsError] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleIsErrorChange = (error: boolean) => {
		setIsError(error);
	};

	const { setTotalPrice } = useContext<OrderContextType>(OrderContext);

	const { order, setOrder } = useContext<OrderContextType>(OrderContext);

	const { mutate: createCheckoutSession } = useCreateCheckoutSessionMutation();

	const {
		data: eventDetails,
		isLoading: isEventDetailsLoading,
		error: eventDetailsError,
	} = useGetEventByIdQuery(eventId);
	const { mutate: addCart } = useAddUserCartMutation();

	const [ticketsPrice, setTicketsPrice] = useState<Record<string, number>>({});

	const hasSeats = seats && seats.trim() !== '';

	const location = useLocation();
	const currentUrl = `${location.pathname}${location.search}`;

	const seatsArray = useMemo(() => {
		return hasSeats ? seats.split(',') : ['no-seat'];
	}, [seats]);

	useEffect(() => {
		if (eventDetails) {
			const prices = eventDetails.prices || {};
			const pricesObj = seatsArray.reduce<Record<string, number>>((acc, seat) => {
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
					images: [`${ASSET_BASE_URL}/images/events/${eventDetails.image}`],
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

	const handleChangePrice = (e: React.ChangeEvent<HTMLSelectElement>, seat: string) => {
		const price = parseFloat(e.target.value);

		const ticketType = getTicketTypeByPrice(eventDetails.prices, price);

		setTicketsPrice(prevPrices => ({
			...prevPrices,
			[seat]: price,
		}));
		setOrder(prevOrder => {
			return prevOrder.map((item: CartTicket) => {
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
		return <p>Ładowanie...</p>;
	}

	const isEventDetailsMissing = !eventDetails || !eventDetails.prices;
	if (eventDetailsError || isEventDetailsMissing) {
		return <p>Nie udało się załadować szczegółów wydarzenia.</p>;
	}

	return (
		<main className={classes['ticket-choice-page']}>
			<h2 className={classes['page-title']}>
				Wybór typu biletów
			</h2>
			<section className={classes['grid-container']}>
				{seats !== undefined &&
					order.map((orderItem, index) => (
						<Order
							key={`${orderItem.seating || 'no-seat'}-${orderItem.price}`}
							ticket={{
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
			</section>

			{seats === undefined && (
				<OrderWithOutSeats
					eventDetails={eventDetails}
					block={block}
					sector={sector}
					onChangeIsError={handleIsErrorChange}
				/>
			)}

			<TotalAmount />

			<footer className={classes.buttons}>
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
			</footer>
			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Błąd!</DialogTitle>
						<DialogDescription>
							Łączna liczba wybranych biletów ma być równa sumie liczby typów biletów.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
							OK
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default TicketChoice;
