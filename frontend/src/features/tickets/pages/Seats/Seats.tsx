import { Link, useNavigate } from 'react-router-dom';
import classes from './Seats.module.css';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useGetOccupiedSeatsQuery from '@/features/tickets/api/queries/useGetOccupiedSeatsQuery';
import { Button } from '@/shared/components/ui/Button/Button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/Dialog/Dialog';
import { getBlockLabel } from '@/features/tickets/utils/blockLabels';
import Seat from '@/features/tickets/components/Seat/Seat';
import type { BlockType } from '@beatriz/shared/tickets';
import {
	parseInitialSelectedSeats,
	isSeatOccupied,
	isSeatSelected,
	hasNoSelectedSeats,
	buildSeatsUrl,
} from '@/features/tickets/utils/seats';

const Seats = () => {
	const navigate = useNavigate();

	const params = Object.fromEntries(new URLSearchParams(window.location.search));

	const { eventId, sector, block, seats } = params;

	const [selectedSeats, setSelectedSeats] = useState<number[]>(() => parseInitialSelectedSeats(seats));

	const [isOpen, setIsOpen] = useState<boolean>(false);

	const location = useLocation();
	const getCurrentUrl = (): string => `${location.pathname}${location.search}`;

	const { data: occupiedSeats, isLoading: isOccupiedSeatsLoading } = useGetOccupiedSeatsQuery(
		eventId,
		sector,
		block as BlockType,
	);

	const handleAddSeats = (seat: number) => {
		if (isSeatOccupied(seat, occupiedSeats)) {
			return;
		}

		const updatedSeats = isSeatSelected(seat, selectedSeats)
			? selectedSeats.filter(element => element !== seat)
			: [...selectedSeats, seat];

		setSelectedSeats(updatedSeats);
		navigate(buildSeatsUrl(location.pathname, eventId, sector, block, updatedSeats), { replace: true });
	};

	localStorage.setItem('selected-seats', JSON.stringify(selectedSeats));

	if (isOccupiedSeatsLoading) {
		return <p>Ładowanie...</p>;
	}

	const sortedSelectedSeats = selectedSeats.toSorted((a, b) => a - b);
	const ticketChoiceUrl = hasNoSelectedSeats(selectedSeats)
		? getCurrentUrl()
		: `/ticket-choice?eventId=${eventId}&sector=${sector}&block=${block}&seats=${sortedSelectedSeats.join(',')}`;

	return (
		<section>
			<h1 className={classes.title}>
				Wybierz miejsca
				<small className={classes.subtitle}>
					{sector} · {getBlockLabel(block)}
				</small>
			</h1>

			<section className={classes.plan}>
				<p className={classes.stage}>Scena</p>

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
			</section>

			<footer className={classes.footer}>
				<ul className={classes.legend} aria-label='Legenda'>
					<li className={classes['legend-item']}>
						<span className={`${classes['legend-seat']} ${classes.free}`} />
						Wolne
					</li>
					<li className={classes['legend-item']}>
						<span className={`${classes['legend-seat']} ${classes.selected}`} />
						Wybrane
					</li>
					<li className={classes['legend-item']}>
						<span className={`${classes['legend-seat']} ${classes.occupied}`} />
						Zajęte
					</li>
				</ul>

				<p className={classes['selected-info']}>
					{hasNoSelectedSeats(selectedSeats) ? (
						'Nie wybrano jeszcze miejsc'
					) : (
						<>
							Wybrano miejsca: <strong>{sortedSelectedSeats.join(', ')}</strong>
						</>
					)}
				</p>

				<nav className={classes['seats-nav']}>
					<Link to={ticketChoiceUrl}>
						<Button
							size='lg'
							className={classes.next}
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
			</footer>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md border-red-700 bg-red-600 text-white'>
					<DialogHeader>
						<DialogTitle className='text-white'>Brak wybranego miejsca!!!</DialogTitle>
						<DialogDescription className='text-red-50'>
							Żeby przejść dalej, musisz najpierw wybrać przynajmniej jedno miejsce siedzące.
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
		</section>
	);
};

export default Seats;
