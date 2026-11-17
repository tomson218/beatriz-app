import { Button } from '@/components/ui/Button/Button';
import { Label } from '@/components/ui/Label/Label';
import { useState, useEffect, useContext } from 'react';
import classes from './OrderWithoutSeats.module.css';
import OrderContext, { type OrderContextType } from '@/context/OrderContext';
import { getNameTypeTicket } from '@/utils/namingTicket';
import type { Event } from '@beatriz/shared/events';
import type { BlockType, TicketType } from '@beatriz/shared/tickets';
import type { CartTicket } from '@beatriz/shared/orders';

type TicketCounts = Record<TicketType, number>;

interface OrderWithoutSeatsProps {
	eventDetails: Event;
	block: BlockType;
	sector: string;
	onChangeIsError: (value: boolean) => void;
}

const shouldMoveTicketFromNormal = (prevCounts: TicketCounts, type: TicketType) => {
	return prevCounts.normal > 0 && type !== 'normal';
};

const OrderWithOutSeats = ({ eventDetails, block, sector, onChangeIsError }: OrderWithoutSeatsProps) => {
	const [totalTickets, setTotalTickets] = useState<number>(1);
	const [countTickets, setCountTickets] = useState<TicketCounts>({
		normal: 1,
		child: 0,
		VIP: 0,
	});

	const isError = totalTickets - Object.values(countTickets).reduce((a, b) => a + b, 0) !== 0;

	const canAllocateTicket = (prevCounts: TicketCounts) =>
		Object.values(prevCounts).reduce((sum, count) => sum + count, 0) < totalTickets;

	useEffect(() => {
		onChangeIsError(isError);
	}, [isError, onChangeIsError]);

	const { setOrder, totalPrice, setTotalPrice } = useContext<OrderContextType>(OrderContext);

	const handleTotalIncrement = () => {
		setTotalTickets(prevTotal => prevTotal + 1);
		setCountTickets(prevCounts => ({ ...prevCounts, normal: prevCounts.normal + 1 }));

		setTotalPrice(prevTotalPrice => {
			const newPrice = prevTotalPrice + eventDetails.prices.normal;
			localStorage.setItem('totalPrice', newPrice);
			return newPrice;
		});
	};

	const handleTotalDecrement = () => {
		setTotalTickets(prevTotal => Math.max(prevTotal - 1, 1));
		setCountTickets(prevCounts => {
			const newNormalCount = Math.max(prevCounts.normal - 1, 0);
			return {
				...prevCounts,
				normal: newNormalCount,
			};
		});
	};

	const handleIncrement = (type: keyof typeof countTickets) => {
		setCountTickets(prevCounts => {
			if (canAllocateTicket(prevCounts)) {
				return {
					...prevCounts,
					[type]: prevCounts[type] + 1,
				};
			} else if (shouldMoveTicketFromNormal(prevCounts, type)) {
				return {
					...prevCounts,
					normal: prevCounts.normal - 1,
					[type]: prevCounts[type] + 1,
				};
			} else {
				return prevCounts;
			}
		});
	};

	const handleDecrement = (type: keyof typeof countTickets) => {
		setCountTickets(prevCounts => {
			const newCount = Math.max(prevCounts[type] - 1, 0);
			return {
				...prevCounts,
				[type]: newCount,
			};
		});
	};

	useEffect(() => {
		const newTotalPrice = (Object.entries(countTickets) as [TicketType, number][]).reduce(
			(total, [key, count]) => total + count * (eventDetails.prices[key] || 0),
			0,
		);
		setTotalPrice(newTotalPrice);
		localStorage.setItem('totalPrice', JSON.stringify(newTotalPrice));
	}, [countTickets, eventDetails.prices, setTotalPrice]);

	useEffect(() => {
		const newOrder: CartTicket[] = (Object.entries(countTickets) as [TicketType, number][]).flatMap(
			([type, count]) =>
				Array.from({ length: count }, () => ({
					eventId: eventDetails?._id,
					price: eventDetails.prices[type],
					sector: sector,
					block: block,
					type,
				})),
		);

		const totalAmount = newOrder.reduce((total, item) => total + (item.price ?? 0), 0);

		setOrder(newOrder);

		setTotalPrice(totalAmount);
		localStorage.setItem('ORDERS', JSON.stringify(newOrder));
	}, [countTickets, eventDetails, setOrder, setTotalPrice, block, sector]);

	if (!eventDetails) {
		return <div>Ładowanie...</div>;
	}

	return (
		<section className={classes.container}>
			<article className={classes['numbers-tickets']}>
				<h3>Wybierz liczbę biletów</h3>
				<p>Łączna liczba: {totalTickets}</p>
				<nav className={classes['buttons-group']}>
					<Button onClick={handleTotalIncrement}>Zwiększ</Button>
					<Button onClick={handleTotalDecrement}>Zmniejsz</Button>
				</nav>
			</article>

			<h3 className={classes['section-title']}>
				Wybierz liczbę danych typów biletów
			</h3>

			{(Object.entries(eventDetails.prices) as [TicketType, number][]).map(([key, price]) => {
				const typeTicket = getNameTypeTicket(key);

				return (
				<article key={key} className={classes['tickets-type']}>
					<Label>
						{typeTicket}: {price} PLN
					</Label>
						<p className={classes['ticket-count']}>Liczba biletów: {countTickets[key]}</p>
						<p className={classes['ticket-total']}>Łączna cena: {countTickets[key] * price} PLN</p>
						<nav className={classes['ticket-buttons']}>
							<Button variant='destructive' onClick={() => handleDecrement(key)}>
								Zmniejsz
							</Button>
							<Button variant='secondary' onClick={() => handleIncrement(key)}>
								Zwiększ
							</Button>
						</nav>
					</article>
				);
			})}
		</section>
	);
};

export default OrderWithOutSeats;
