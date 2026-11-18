import { Button } from '@/components/ui/Button/Button';
import classes from './Block.module.css';
import type { BlockType } from '@beatriz/shared/tickets';

interface BlockProps {
	onSelect: (block: BlockType) => void;
	isSelected: boolean;
	block: BlockType;
}

const Block = ({ onSelect, isSelected, block }: BlockProps) => {
	return (
		<Button
			className={`${classes.block} ${classes[block]} ${isSelected ? classes.selected : ''}`}
			onClick={() => onSelect(block)}></Button>
	);
};

export default Block;
