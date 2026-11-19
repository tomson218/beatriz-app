import classes from './Block.module.css';
import { getBlockLabel } from '@/features/tickets/utils/blockLabels';
import type { BlockType } from '@beatriz/shared/tickets';

interface BlockProps {
	onSelect: (block: BlockType) => void;
	isSelected: boolean;
	isDimmed?: boolean;
	block: BlockType;
}

const Block = ({ onSelect, isSelected, isDimmed = false, block }: BlockProps) => {
	return (
		<button
			type='button'
			className={`${classes.block} ${classes[block]} ${isSelected ? classes.selected : ''} ${isDimmed ? classes.dimmed : ''}`}
			aria-pressed={isSelected}
			onClick={() => onSelect(block)}>
			{getBlockLabel(block)}
		</button>
	);
};

export default Block;
