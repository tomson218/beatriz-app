import { Button } from '@/components/ui/button';
import { useState, useEffect, useContext } from 'react';
import classes from './OrderWithoutSeats.module.css';
import OrderContext from '@/context/OrderContext';
import { getNameTypeTicket } from '@/utils/namingTicket';
import { ASSET_BASE_URL } from '@/api/apiConfig';
import type { Event } from '@beatriz/shared';

type TicketType = keyof Event['prices'];
type TicketCounts = Record<TicketType, number>;

type OrderTicket = {
	id: number;
	date?: Date | string;
	eventId?: string;
	images: string[];
	name?: string;
	price?: number;
	seating?: number | string;
	sector?: string;
	block?: string;
	type?: string;
};

interface OrderWithoutSeatsProps {
	eventDetails: Event;
	block: string;
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

	useEffect(() => {
		onChangeIsError(isError);
	}, [isError, onChangeIsError]);

	const { setOrder, totalPrice, setTotalPrice } = useContext(OrderContext);

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
			const totalAllocated = Object.values(prevCounts).reduce((sum, count) => sum + count, 0);

			if (totalAllocated < totalTickets) {
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
		const newOrder: OrderTicket[] = [];
		let idCounter = 0;

		(Object.entries(countTickets) as [TicketType, number][]).forEach(([type, count]) => {
			for (let i = 0; i < count; i++) {
				newOrder.push({
					id: idCounter++,
					date: eventDetails?.date,
					eventId: eventDetails?._id,
					images: [`${ASSET_BASE_URL}/images/events/${eventDetails?.image}`],
					name: eventDetails?.name,
					price: eventDetails.prices[type],
					seating: undefined,
					sector: sector,
					block: block,
					type,
				});
			}
		});

		const totalAmount = newOrder.reduce((total, item) => total + (item.price ?? 0), 0);

		setOrder(newOrder);

		setTotalPrice(totalAmount);
		localStorage.setItem('ORDERS', JSON.stringify(newOrder));
	}, [countTickets, eventDetails, setOrder, setTotalPrice, block, sector]);

	if (!eventDetails) {
		return <div>Loading...</div>;
	}

	return (
		<div className={classes.container}>
			<div className={classes['numbers-tickets']}>
				<h3>Wybierz liczbę biletów</h3>
				<div>Łączna liczba: {totalTickets}</div>
				<div className={classes['buttons-group']}>
					<Button onClick={handleTotalIncrement}>Zwiększ</Button>
					<Button onClick={handleTotalDecrement}>Zmniejsz</Button>
				</div>
			</div>

			<h3
				style={{
					textAlign: 'center',
					marginTop: '1rem',
					fontSize: '1.5rem',
					fontWeight: '500',
				}}>
				Wybierz liczbę danych typów biletów
			</h3>

			{(Object.entries(eventDetails.prices) as [TicketType, number][]).map(([key, price]) => {
				const typeTicket = getNameTypeTicket(key);

				return (
					<div key={key} className={classes['tickets-type']}>
						<label style={{ flex: '1', fontWeight: 'bold' }}>
							{typeTicket}: {price} PLN
						</label>
						<div style={{ flex: '1' }}>Liczba biletów: {countTickets[key]}</div>
						<div style={{ flex: '1' }}>Łączna cena: {countTickets[key] * price} PLN</div>
						<div style={{ display: 'flex', gap: '1rem' }}>
							<Button variant='destructive' onClick={() => handleDecrement(key)}>
								Zmniejsz
							</Button>
							<Button variant='secondary' onClick={() => handleIncrement(key)}>
								Zwiększ
							</Button>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default OrderWithOutSeats;
