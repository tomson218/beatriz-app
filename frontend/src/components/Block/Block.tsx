import { Button } from '@/components/ui/button';
import classes from './Block.module.css';

interface BlockProps {
	onClick: (value: string) => void;
	isSelected: boolean;
	value: string;
}

const Block = ({ onClick, isSelected, value }: BlockProps) => {
	return (
		<Button
			className={`${classes.block} ${classes[value]}  ${isSelected ? classes.selected : ''}`}
			onClick={() => onClick(value)}></Button>
	);
};

export default Block;
