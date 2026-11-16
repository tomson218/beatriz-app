import { Link, useNavigate } from 'react-router-dom';
import classes from './Seats.module.css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useGetOccupiedSeatsQuery from '@/api/queries/useGetOccupiedSeatsQuery';
import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import Seat from '@/components/Seat/Seat';
import {
	parseInitialSelectedSeats,
	isSeatOccupied,
	isSeatSelected,
	hasNoSelectedSeats,
} from '@/utils/seats';

const Seats = () => {
	const navigate = useNavigate();

	const params = Object.fromEntries(new URLSearchParams(window.location.search));

	const { eventId, sector, block, seats } = params;

	const [selectedSeats, setSelectedSeats] = useState<number[]>(() => parseInitialSelectedSeats(seats));

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const location = useLocation();
	const getCurrentUrl = (): string => `${location.pathname}${location.search}`;

	const { data: occupiedSeats, isLoading: isOccupiedSeatsLoading } = useGetOccupiedSeatsQuery(eventId, sector, block);

	const handleAddSeats = (seat: number) => {
		if (isSeatOccupied(seat, occupiedSeats)) {
			return;
		}

		if (isSeatSelected(seat, selectedSeats)) {
			setSelectedSeats(prevSelectedSeats => {
				const updatedSeats = prevSelectedSeats.filter(element => element !== seat);
				const newUrl = `${location.pathname}?eventId=${eventId}&sector=${sector}&block=${block}&seats=${updatedSeats.join(',')}`;
				navigate(newUrl, { replace: true });
				return updatedSeats;
			});
		} else {
			setSelectedSeats(prevSelectedSeats => {
				const updatedSeats = [...prevSelectedSeats, seat];
				const newUrl = `${location.pathname}?eventId=${eventId}&sector=${sector}&block=${block}&seats=${updatedSeats.join(',')}`;
				navigate(newUrl, { replace: true });
				return updatedSeats;
			});
		}
	};

	localStorage.setItem('selected-seats', JSON.stringify(selectedSeats));

	if (isOccupiedSeatsLoading) {
		return <p>Ładowanie...</p>;
	}

	const sortedSelectedSeats = [...selectedSeats].sort((a, b) => a - b);

	return (
		<section className={classes['seats-page']}>
			<h1 className={classes.title}>
				Wybierz miejsca dla sektora: {sector} i strefy {block}
			</h1>

			<section className={classes['seats-container']}>
				{Array.from({ length: 100 }, (_, index) => {
					const seatNumber = index + 1;
					return (
						<Seat
							key={seatNumber}
							isSelected={isSeatSelected(seatNumber, selectedSeats)}
							isOccupied={isSeatOccupied(seatNumber, occupiedSeats)}
							onAddSeats={handleAddSeats}
							index={index}
						/>
					);
				})}
			</section>

			<aside className={classes['legend']}>
				<h3 className={classes['legend-title']}>Legenda</h3>
				<div className={classes['legend-row']}>
					<article className={classes['legend-item']}>
						<div className={`${classes['legend-seat']} ${classes['free']}`}></div>
						<span>wolne</span>
					</article>

					<article className={classes['legend-item']}>
						<div className={`${classes['legend-seat']} ${classes['selected']}`}></div>

						<span>wybrane</span>
					</article>

					<article className={classes['legend-item']}>
						<div className={`${classes['legend-seat']} ${classes['occupied']}`}></div>
						<span>zajęte</span>
					</article>
				</div>
			</aside>

			<nav className={classes['seats-nav']}>
				<Link
					to={
						!hasNoSelectedSeats(selectedSeats)
							? `/ticket-choice?eventId=${eventId}&sector=${sector}&block=${block}&seats=${sortedSelectedSeats.join(',')}`
							: getCurrentUrl()
						}>
					<Button
						onClick={() => {
							localStorage.setItem('seats', JSON.stringify(selectedSeats));
							if (hasNoSelectedSeats(selectedSeats)) {
								setIsOpen(true);
							}
						}}>
						Przejdź do wyboru biletów
					</Button>
				</Link>
			</nav>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Brak wybranego miejsca!!!</DialogTitle>
						<DialogDescription>
							Żeby przejść dalej, musisz najpierw wybrać przynajmniej jedno miejsce siedzące.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
							OK
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
};

export default Seats;
