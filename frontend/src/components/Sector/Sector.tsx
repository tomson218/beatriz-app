import classes from './Sector.module.css';

interface SectorProps {
	sectorName: string;
	isSelected: boolean;
	isDisabled: boolean;
	index: number;
	onClick: (sectorName: string) => void;
}

const Sector = ({ sectorName, isSelected, isDisabled, index, onClick }: SectorProps) => {
	const cssClasses = `
	  ${classes.sector}
	  ${classes[`sector-${index + 1}`]} 
	  ${isSelected ? classes.selected : ''} 
	  ${isDisabled ? classes.disabled : ''}
	`;

	return (
		<div className={cssClasses} onClick={() => onClick(sectorName)} id={`sektor${index + 1}`} key={sectorName}>
			{sectorName}
		</div>
	);
};

export default Sector;
