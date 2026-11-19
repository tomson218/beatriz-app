import classes from './Seat.module.css';

interface SeatProps {
	isOccupied: boolean;
	isSelected: boolean;
	index: number;
	onAddSeats: (index: number) => void;
}

const Seat = ({ isOccupied, isSelected, index, onAddSeats }: SeatProps) => {
	const seatNumber = index + 1;
	const cssClasses = `${classes.seat} ${isOccupied ? classes.occupied : ''} ${isSelected ? classes.selected : ''}`;

	return (
		<button
			type='button'
			className={cssClasses}
			disabled={isOccupied}
			aria-pressed={isSelected}
			aria-label={`Miejsce ${seatNumber}${isOccupied ? ' (zajęte)' : ''}`}
			onClick={() => onAddSeats(seatNumber)}>
			{seatNumber}
		</button>
	);
};

export default Seat;
