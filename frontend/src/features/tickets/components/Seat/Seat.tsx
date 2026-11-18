import classes from './Seat.module.css';

interface SeatProps {
	isOccupied: boolean;
	isSelected: boolean;
	index: number;
	onAddSeats: (index: number) => void;
}

const Seat = ({ isOccupied, isSelected, index, onAddSeats }: SeatProps) => {
	const cssClasses = `
    ${classes.seat}
    ${isOccupied ? classes.occupied : ''}
    ${isSelected ? classes.selected : ''}
  `;

	return (
		<div className={cssClasses} onClick={() => onAddSeats(index + 1)}>
			{index + 1}
		</div>
	);
};

export default Seat;
