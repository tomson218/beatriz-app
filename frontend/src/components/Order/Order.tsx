import { formattedDate, formattedTime } from '@/utils/formatting-date';
import { parseEventDate } from '@/utils/eventDate';
import { getNameTypeTicket, getNameBlock } from '@/utils/namingTicket';
import type { Event } from '@beatriz/shared/events';
import type { CartTicket } from '@beatriz/shared/orders';
import type { TicketType } from '@beatriz/shared/tickets';
import { Label } from '@/components/ui/Label/Label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/Select/Select';
import classes from './Order.module.css';
import { ASSET_BASE_URL } from '@/api/apiConfig';

interface OrderProps {
	ticket: CartTicket;
	eventDetails: Event;
	onChangePrice?: (price: number) => void;
	price: number;
	isChoice?: boolean;
	isSummary?: boolean;
	type: TicketType;
}

const Order = ({ ticket, eventDetails, onChangePrice, price, isChoice, isSummary, type }: OrderProps) => {
	const isEventDetailsMissing = !eventDetails || !eventDetails.prices;
	if (isEventDetailsMissing) {
		return <p>Ładowanie szczegółów zamówienia...</p>;
	}

	const eventDate = parseEventDate(eventDetails.date);
	const typeTicket = getNameTypeTicket(type);

	return (
		<article className={classes['order-item']}>
			<header>
				<h3>{eventDetails.name}</h3>
			</header>
			<p>
				Data: {formattedDate(eventDate)} o {formattedTime(eventDate)}
			</p>
			<figure>
				<img
					src={`${ASSET_BASE_URL}/images/events/${eventDetails.image}`}
					alt={eventDetails.name}
				/>
			</figure>
			<section>
 			<p>
 				<strong>Sektor:</strong> {ticket.sector}
 			</p>
 			<p>
 				<strong>Strefa:</strong> {getNameBlock(ticket.block)}
 			</p>
 			{ticket.seat && (
 				<p>
 					<strong>Miejsce:</strong> {ticket.seat}
 				</p>
 			)}
				{isSummary && (
					<p>
						<strong>Rodzaj biletu:</strong> {typeTicket}
						<br />
						<strong>Cena:</strong> {price.toFixed(2)} PLN
					</p>
				)}
			</section>
 	{isChoice && onChangePrice && (
 		<>
 			<Label>Wybierz rodzaj biletu:</Label>
 			<Select
 				value={price.toString()}
 				onValueChange={value => onChangePrice(parseFloat(value))}>
 				<SelectTrigger>
 					<SelectValue />
 				</SelectTrigger>
 				<SelectContent>
 					{Object.entries(eventDetails.prices).map(([k, v]) => (
 						<SelectItem key={k} value={v.toString()}>
 							{getNameTypeTicket(k as TicketType)}: {v.toFixed(2)} PLN
 						</SelectItem>
 					))}
 				</SelectContent>
 			</Select>
 		</>
 	)}
		</article>
	);
};

export default Order;
