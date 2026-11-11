import { Button } from '@/components/ui/button';
import classes from './Blocks.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGetEventByIdQuery from '@/api/queries/useGetEventByIdQuery';
import Block from '../../components/Block/Block';

import Modal from '../../components/UI/Modal/Modal';

interface Params {
	eventId: string;
	sector?: string;
	block?: string;
}
const Blocks = () => {
	const navigate = useNavigate();

	const params = Object.fromEntries(new URLSearchParams(window.location.search)) as Params;

	const { eventId, sector, block } = params;

	const [selectedBlock, setSelectedBlock] = useState(block ?? '');
	const [isOpen, setIsOpen] = useState(false);

	const { data: eventDetails, isLoading: isEventDetailsLoading } = useGetEventByIdQuery(eventId);

	if (isEventDetailsLoading) return <div>Loading...</div>;

	const isSeatRequired = eventDetails.seatRequired;

	const handleSelectBlock = (id: string) => {
		setSelectedBlock(id);
		const newUrl = `/blocks?eventId=${eventId}&sector=${sector}&block=${id}`;
		navigate(newUrl, { replace: true });
	};

	const handleChoosePage = () => {
		if (!selectedBlock) {
			setIsOpen(true);
			return;
		} else if (selectedBlock && isSeatRequired) {
			return navigate(`/seats?eventId=${eventId}&sector=${sector}&block=${selectedBlock}`);
		} else {
			return navigate(`/ticket-choice?eventId=${eventId}&sector=${sector}&block=${selectedBlock}`);
		}
	};

	return (
		<div className={classes.container}>
			<h1 className={classes.heading}>Wybierz strefę</h1>

			<section className={classes.blocks}>
				<Block value='blue' onClick={handleSelectBlock} isSelected={selectedBlock === 'blue'} />
				<Block value='green' onClick={handleSelectBlock} isSelected={selectedBlock === 'green'} />
				<Block value='yellow' onClick={handleSelectBlock} isSelected={selectedBlock === 'yellow'} />
				<Block value='black' onClick={handleSelectBlock} isSelected={selectedBlock === 'black'} />
			</section>

			<Button onClick={handleChoosePage} className={classes.link}>
				{isSeatRequired ? 'Wybierz konkretne miejsce' : 'Przejdź do wyboru biletów'}
			</Button>

			{isOpen && (
				<Modal
					title='Brak wybranej strefy!!!'
					content='Żeby przejść dalej, musisz najpierw wybrać daną strefę.'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
};

export default Blocks;
