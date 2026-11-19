import { Button } from '@/shared/components/ui/Button/Button';
import classes from './Blocks.module.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Event } from '@beatriz/shared/events';
import type { BlockType } from '@beatriz/shared/tickets';
import useGetEventByIdQuery from '@/features/events/api/queries/useGetEventByIdQuery';
import { getBlockLabel } from '@/features/tickets/utils/blockLabels';
import Block from '@/features/tickets/components/Block/Block';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/Dialog/Dialog';

interface Params {
	eventId: Event["_id"];
	sector?: string;
	block?: BlockType;
}
const Blocks = () => {
	const navigate = useNavigate();

	const params = Object.fromEntries(new URLSearchParams(window.location.search)) as Params;

	const { eventId, sector, block } = params;

	const [selectedBlock, setSelectedBlock] = useState<BlockType>(block ?? '');
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const { data: eventDetails, isLoading: isEventDetailsLoading } = useGetEventByIdQuery(eventId);

	if (isEventDetailsLoading) return <div>Ładowanie...</div>;

	const isBlockNotSelected = !selectedBlock;
	const hasSelection = !isBlockNotSelected;
	const isSeatRequired = eventDetails.seatRequired;
	const needsSeatSelection = selectedBlock && isSeatRequired;

	const buildNextPageUrl = () => {
		if (isBlockNotSelected) return null;
		const base = `?eventId=${eventId}&sector=${sector}&block=${selectedBlock}`;
		return needsSeatSelection ? `/seats${base}` : `/ticket-choice${base}`;
	};

	const handleSelectBlock = (id: BlockType) => {
		setSelectedBlock(id);
		const newUrl = `/blocks?eventId=${eventId}&sector=${sector}&block=${id}`;
		navigate(newUrl, { replace: true });
	};

	const handleChoosePage = () => {
		if (isBlockNotSelected) {
			setIsOpen(true);
			return;
		}
		const nextUrl = buildNextPageUrl();
		if (nextUrl) return navigate(nextUrl);
	};

	return (
		<main>
			<h1 className={classes.heading}>Wybierz strefę</h1>

			<section className={classes.blocks}>
				<Block block='blue' onSelect={handleSelectBlock} isSelected={selectedBlock === 'blue'} isDimmed={hasSelection && selectedBlock !== 'blue'} />
				<Block block='green' onSelect={handleSelectBlock} isSelected={selectedBlock === 'green'} isDimmed={hasSelection && selectedBlock !== 'green'} />
				<Block block='yellow' onSelect={handleSelectBlock} isSelected={selectedBlock === 'yellow'} isDimmed={hasSelection && selectedBlock !== 'yellow'} />
				<Block block='black' onSelect={handleSelectBlock} isSelected={selectedBlock === 'black'} isDimmed={hasSelection && selectedBlock !== 'black'} />
			</section>

			<footer className={classes.footer}>
				<p className={classes['selected-info']}>
					{selectedBlock ? (
						<>
							Wybrano: <strong>{getBlockLabel(selectedBlock)}</strong>
						</>
					) : (
						'Nie wybrano jeszcze strefy'
					)}
				</p>

				<Button size='lg' onClick={handleChoosePage} className={classes.link}>
					{isSeatRequired ? 'Wybierz konkretne miejsce' : 'Przejdź do wyboru biletów'}
				</Button>
			</footer>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Brak wybranej strefy!!!</DialogTitle>
						<DialogDescription>Żeby przejść dalej, musisz najpierw wybrać daną strefę.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
							OK
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</main>
	);
};

export default Blocks;
