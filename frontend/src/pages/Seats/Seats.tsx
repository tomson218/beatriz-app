import { Link, useNavigate } from 'react-router-dom';
import classes from './Seats.module.css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useGetOccupiedSeatsQuery from '../../api/queries/useGetOccupiedSeatsQuery';
import { Button } from '@/components/ui/button';
import Modal from '../../components/UI/Modal/Modal';
import Seat from '../../components/Seat/Seat';

const Seats = () => {
	const navigate = useNavigate();

	const params = Object.fromEntries(new URLSearchParams(window.location.search));

	const { eventId, sector, block, seats } = params;

	const INITIAL_SELECTED_SEATS = seats && seats !== '0' ? seats.split(',').map(seat => +seat) : [];

	const [selectedSeats, setSelectedSeats] = useState(INITIAL_SELECTED_SEATS ?? []);

	const [isOpen, setIsOpen] = useState(false);

	const location = useLocation();
	const currentUrl = `${location.pathname}${location.search}`;

	const { data: occupiedSeats, isLoading: isOccupiedSeatsLoading } = useGetOccupiedSeatsQuery(eventId, sector, block);

	const handleAddSeats = (seat: number) => {
		let updatedSeats;
		if (occupiedSeats.includes(seat)) {
			return;
		} else if (selectedSeats.includes(seat)) {
			setSelectedSeats(prevSelectedSeats => {
				updatedSeats = prevSelectedSeats.filter(element => element !== seat);

				const newUrl = `${
					location.pathname
				}?eventId=${eventId}&sector=${sector}&block=${block}&seats=${updatedSeats.join(',')}`;
				navigate(newUrl, { replace: true });

				return updatedSeats;
			});
		} else if (!selectedSeats.includes(seat)) {
			setSelectedSeats(prevSelectedSeats => {
				updatedSeats = [...prevSelectedSeats, seat];

				const newUrl = `${
					location.pathname
				}?eventId=${eventId}&sector=${sector}&block=${block}&seats=${updatedSeats.join(',')}`;
				navigate(newUrl, { replace: true });
				return updatedSeats;
			});
		}
	};

	localStorage.setItem('selected-seats', JSON.stringify(selectedSeats));

	if (isOccupiedSeatsLoading) {
		return <p>Loading...</p>;
	}

	const sortedSelectedSeats = [...selectedSeats].sort((a, b) => a - b);

	return (
		<section style={{ minHeight: '94.4dvh', backgroundColor: 'white' }}>
			<h1 className={classes.title} style={{ color: 'black' }}>
				Wybierz miejsca dla sektora: {sector} i strefy {block}
			</h1>

			<div className={classes['seats-container']}>
				{Array.from({ length: 100 }, (v, index) => (
					<Seat
						isSelected={selectedSeats.includes(index + 1)}
						isOccupied={occupiedSeats.includes(index + 1)}
						onAddSeats={handleAddSeats}
						index={index}
					/>
				))}
			</div>

			<section className={classes['legend']} style={{}}>
				<h3 style={{ textAlign: 'center', padding: '1rem' }}>Legenda</h3>
				<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
					<article style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<div className={`${classes['legend-seat']} ${classes['free']}`}></div>
						<span>wolne</span>
					</article>

					<article style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<div className={`${classes['legend-seat']} ${classes['selected']}`}></div>

						<span>wybrane</span>
					</article>

					<article style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
						<div className={`${classes['legend-seat']} ${classes['occupied']}`}></div>
						<span>zajęte</span>
					</article>
				</div>
			</section>

			<div style={{ padding: '0 1rem 1rem' }}>
				<Link
					to={
						selectedSeats.length !== 0
							? `/ticket-choice?eventId=${eventId}&sector=${sector}&block=${block}&seats=${sortedSelectedSeats.join(
									','
							  )}`
							: `${currentUrl}`
					}>
					<Button
						onClick={() => {
							localStorage.setItem('seats', selectedSeats);
							if (selectedSeats.length === 0) {
								setIsOpen(true);
							}
						}}>
						Przejdź do wyboru biletów
					</Button>
				</Link>
			</div>

			{isOpen && (
				<Modal
					title='Brak wybranego miejsca!!!'
					content='Żeby przejść dalej, musisz najpierw wybrać przynajmniej jedno miejsce siedzące.'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</section>
	);
};

export default Seats;
