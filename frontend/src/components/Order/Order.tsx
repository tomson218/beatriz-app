import { formattedDate, formattedTime } from '../../utils/formatting-date';
import { getNameTypeTicket, getNameBlock } from '@/utils/namingTicket';

interface OrderProps {
	obj: {};
	eventDetails: { name: string; date: string; image: string; prices: { [key: string]: number } };
	onChangePrice: (price: number) => void;
	price: number;
	isChoice: boolean;
	isSummary: boolean;
	type: string;
}

const Order = ({ obj, eventDetails, onChangePrice, price, isChoice, isSummary, type }: OrderProps) => {
	if (!eventDetails || !eventDetails.prices) {
		return <p>Loading order details...</p>;
	}

	const eventDate = new Date(eventDetails.date);

	const typeTicket = getNameTypeTicket(type);

	return (
		<div
			className='order-item'
			style={{
				margin: '3rem auto',
				padding: '3rem',
				border: '5px solid black',
				borderRadius: '1rem',
				backgroundColor: 'white',
				display: 'inline-flex',
				flexDirection: 'column',
				gap: '1rem',
				width: '100%',
				maxWidth: '600px',
			}}>
			<h3 style={{ fontWeight: 600 }}>{eventDetails.name}</h3>
			<p>
				Data: {formattedDate(eventDate)} o {formattedTime(eventDate)}
			</p>
			<img
				src={`http://localhost:3000/images/events/${eventDetails.image}`}
				alt={eventDetails.name}
				style={{
					borderRadius: '1rem',
					width: '100%',
					height: '100%',
					objectFit: 'cover',
				}}
			/>
			<div>
				<p>
					<strong>Sektor:</strong> {obj.sector}
				</p>
				<p>
					<strong>Strefa:</strong> {getNameBlock(obj.block)}
				</p>
				{obj.seat && (
					<p>
						<strong>Miejsce:</strong> {obj.seat}
					</p>
				)}
				{isSummary && (
					<p>
						<strong>Rodzaj biletu:</strong> {typeTicket}
						<br></br>
						<strong>Cena:</strong> {price.toFixed(2)} PLN
					</p>
				)}
			</div>
			{isChoice && (
				<label style={{ display: 'flex', alignItems: 'center' }}>
					Wybierz rodzaj biletu:
					<select
						value={price}
						onChange={onChangePrice}
						style={{
							backgroundColor: 'black',
							color: 'white',
							padding: '.5rem',
							marginLeft: '.5rem',
							borderRadius: '0.5rem',
						}}>
						{Object.entries(eventDetails.prices).map(([k, v]) => (
							<option key={k} value={v}>
								{getNameTypeTicket(k)}: {v.toFixed(2)} PLN
							</option>
						))}
					</select>
				</label>
			)}
		</div>
	);
};

export default Order;
