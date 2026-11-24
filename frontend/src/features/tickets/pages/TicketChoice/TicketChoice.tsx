import { useState, useEffect, useMemo, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useGetEventByIdQuery from '@/features/events/api/queries/useGetEventByIdQuery';
import { Button } from '@/shared/components/ui/Button/Button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/Dialog/Dialog';
import classes from './TicketChoice.module.css';
import Order from '@/features/orders/components/Order/Order';
import OrderContext, { type OrderContextType } from '@/features/orders/context/OrderContext';
import OrderWithOutSeats from '@/features/orders/components/OrderWithoutSeats/OrderWithoutSeats';
import TotalAmount from '@/features/orders/components/TotalAmount/TotalAmount';
import type { EventDto } from '@beatriz/shared/events';
import type { BlockType, TicketType } from '@beatriz/shared/tickets';
import type { CartTicket } from '@beatriz/shared/orders';
import { ASSET_BASE_URL } from '@/shared/api/apiConfig';
import { NO_SEAT, isNoSeatPlaceholder } from '@/features/tickets/utils/seats';

/** Ticket price for a seat (key: the seat number or NO_SEAT). */
type SeatPrices = Record<string, number>;

type Prices = NonNullable<EventDto['prices']>;

/** Sprawdza czy pozycja zamówienia dotyczy danego miejsca (lub zamówienia bez miejsc, gdy seat to NO_SEAT). */
const isOrderItemForSeat = (item: CartTicket, seat: string): boolean => {
	const isSameSeat = item?.seating === seat;
	const hasNoSeating = !item?.seating;
	const isNoSeatSelected = isNoSeatPlaceholder(seat);
	const isItemWithoutSeatMatching = hasNoSeating && isNoSeatSelected;

	return isSameSeat || isItemWithoutSeatMatching;
};

/** Ticket type that has the given price; defaults to `normal` (the server rejects an order without a type). */
const getTicketTypeByPrice = (prices: Prices, value: number): TicketType => {
	const ticketType = Object.keys(prices).find(key => prices[key as TicketType] === value) as TicketType | undefined;

	return ticketType ?? 'normal';
};

const TicketChoice = () => {
	const params = Object.fromEntries(new URLSearchParams(window.location.search));
	const { eventId, sector, seats } = params;
	const block = params.block as BlockType;

	const [isError, setIsError] = useState<boolean>(false);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const handleIsErrorChange = (error: boolean) => {
		setIsError(error);
	};

	const { setTotalPrice } = useContext<OrderContextType>(OrderContext);

	const { order, setOrder } = useContext<OrderContextType>(OrderContext);

	const {
		data: eventDetails,
		isLoading: isEventDetailsLoading,
		error: eventDetailsError,
	} = useGetEventByIdQuery(eventId);

	const [ticketsPrice, setTicketsPrice] = useState<SeatPrices>({});

	const hasSeatsParam = Boolean(seats);
	const isSeatsParamBlank = seats?.trim() === '';
	const hasSeats = hasSeatsParam && !isSeatsParamBlank;

	const location = useLocation();
	const currentUrl = `${location.pathname}${location.search}`;

	const seatsArray = useMemo(() => {
		return hasSeats ? seats.split(',') : [NO_SEAT];
	}, [seats]);

	useEffect(() => {
		if (eventDetails) {
			const prices = eventDetails.prices || {};
			const pricesObj = seatsArray.reduce<SeatPrices>((acc, seat) => {
				acc[seat] = prices.normal ?? 0;
				return acc;
			}, {});
			setTicketsPrice(pricesObj);
		}
	}, [eventDetails, seatsArray]);

	useEffect(() => {
		if (eventDetails) {
			setOrder(() => {
				const newOrder: CartTicket[] = seatsArray.map(seat => {
					// ticketsPrice is set by a separate effect, so it can still be empty on the first render.
					const seatPrice = ticketsPrice[seat] ?? eventDetails.prices?.normal ?? 0;

					return {
						eventId,
						sector,
						block,
						name: eventDetails.name,
						date: eventDetails.date,
						images: [`${ASSET_BASE_URL}/images/events/${eventDetails.image}`],
						seating: isNoSeatPlaceholder(seat) ? undefined : seat,
						price: seatPrice,
						type: getTicketTypeByPrice(eventDetails.prices ?? {}, seatPrice),
					};
				});

				localStorage.setItem('ORDERS', JSON.stringify(newOrder));
				// A rebuilt order has no discount any more, so the remembered discount code is no longer valid.
				localStorage.removeItem('code');

				return newOrder;
			});
		}
	}, [eventDetails, ticketsPrice, seatsArray, eventId, sector]);

	useEffect(() => {
		const totalAmount = hasSeats ? order.reduce((sum, item) => sum + item?.price, 0) : ticketsPrice[NO_SEAT] || 0;

		setTotalPrice(totalAmount);
		localStorage.setItem('totalPrice', JSON.stringify(totalAmount));
	}, [order, ticketsPrice, hasSeats, setTotalPrice]);

	/** `Order` passes the price of the chosen ticket type (a number), not a change event. */
	const handleChangePrice = (price: number, seat: string) => {
		const ticketType = getTicketTypeByPrice(eventDetails?.prices ?? {}, price);

		setTicketsPrice(prevPrices => ({
			...prevPrices,
			[seat]: price,
		}));
		setOrder(prevOrder => {
			return prevOrder.map((item: CartTicket) => {
				if (isOrderItemForSeat(item, seat)) {
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

	if (isEventDetailsLoading) {
		return <p>Ładowanie...</p>;
	}

	const hasNoEventDetails = !eventDetails;
	const hasNoEventPrices = !eventDetails?.prices;
	const isEventDetailsMissing = hasNoEventDetails || hasNoEventPrices;
	const isEventDetailsUnavailable = eventDetailsError || isEventDetailsMissing;

	if (isEventDetailsUnavailable) {
		return <p>Nie udało się załadować szczegółów wydarzenia.</p>;
	}

	const isSeatedOrder = seats !== undefined;
	const isOrderWithoutSeats = seats === undefined;
	const canGoToSummary = !isError;

	return (
		<main>
			<h2 className={classes['page-title']}>Wybór typu biletów</h2>
			<section className={classes['grid-container']}>
				{isSeatedOrder &&
					order.map(orderItem => (
						<Order
							key={`${orderItem.seating || NO_SEAT}-${orderItem.price}`}
							ticket={{
								eventId: orderItem.eventId,
								sector: orderItem.sector,
								seat: orderItem.seating,
								block: orderItem.block,
							}}
							eventDetails={eventDetails}
							onChangePrice={price => handleChangePrice(price, orderItem.seating || NO_SEAT)}
							price={orderItem?.price}
							type={orderItem?.type}
							isChoice
						/>
					))}
			</section>

			{isOrderWithoutSeats && (
				<OrderWithOutSeats
					eventDetails={eventDetails}
					block={block}
					sector={sector}
					onChangeIsError={handleIsErrorChange}
				/>
			)}

			<TotalAmount />

			<footer className={classes.buttons}>
				<Link to={canGoToSummary ? `/summary?eventId=${eventId}` : currentUrl}>
					<Button
						size='lg'
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
				<DialogContent className='sm:max-w-md border-red-700 bg-red-600 text-white'>
					<DialogHeader>
						<DialogTitle className='text-white'>Błąd!</DialogTitle>
						<DialogDescription className='text-red-50'>
							Łączna liczba wybranych biletów ma być równa sumie liczby typów biletów.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							type='button'
							variant='outline'
							className='border-white bg-white text-red-700 hover:bg-red-50'
							onClick={() => setIsOpen(false)}>
							OK
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default TicketChoice;
