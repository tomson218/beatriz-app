import { Link, useNavigate } from 'react-router-dom';
import classes from './Hall.module.css';
import { useEffect, useState } from 'react';
import useGetEventByIdQuery from '@/features/events/api/queries/useGetEventByIdQuery';
import { Button } from '@/shared/components/ui/Button/Button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/components/ui/Dialog/Dialog';
import Sector from '@/features/tickets/components/Sector/Sector';
import { SECTORS } from '@beatriz/shared/enums/sectors';
import { isSectorAvailable, buildBlocksUrl } from '@/features/tickets/utils/sector';

const Hall = () => {
	const navigate = useNavigate();
	const currentUrl = `${location.pathname}${location.search}`;
	const params = Object.fromEntries(new URLSearchParams(window.location.search));
	const { eventId, sector } = params;
	const { data: eventDetails, isLoading: isEventLoading } = useGetEventByIdQuery(eventId);
	const [selectedSector, setSelectedSector] = useState<string>(sector ?? '');
	const [availableSector, setAvailableSector] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	useEffect(() => {
		if (eventDetails) {
			const availableSectors = eventDetails?.sectors ?? [];
			setAvailableSector(availableSectors);
		}
	}, [eventDetails]);

	const handleSelectSector = (sector: string) => {
		const isSectorUnavailable = !isSectorAvailable(sector, availableSector);

		if (isSectorUnavailable) {
			return;
		}
		setSelectedSector(sector);

		const newUrl = `${location.pathname}?eventId=${eventId}&sector=${sector}`;
		navigate(newUrl, { replace: true });

		localStorage.setItem('sector', sector);
	};

	if (isEventLoading) {
		return <p>Ładowanie danych...</p>;
	}

	const blocksUrl = buildBlocksUrl(eventId, selectedSector);
	const nextUrl = blocksUrl || currentUrl;

	const handleChooseBlocksClick = () => {
		const isSectorNotSelected = !selectedSector;

		if (isSectorNotSelected) {
			setIsOpen(true);
		}
	};

	return (
		<main>
			<h1 className={classes.title}>
				Wybierz odpowiedni sektor hali
			</h1>
			<section className={classes.container}>
				<figure className={classes['hala-container']}>
					<div className={classes['hala-grid']}>
						{SECTORS.map((sectorName, index) => (
							<Sector
								key={sectorName}
								sectorName={sectorName}
								isSelected={selectedSector === sectorName}
								isDisabled={!isSectorAvailable(sectorName, availableSector)}
								index={index}
								onClick={handleSelectSector}
							/>
						))}

						<div className={classes.hala}></div>
					</div>
				</figure>
			</section>

			<footer className={classes['hall-footer']}>
				<ul className={classes.legend} aria-label='Legenda'>
					<li className={classes['legend-item']}>
						<span className={`${classes['legend-dot']} ${classes['legend-dot--available']}`} />
						Dostępny
					</li>
					<li className={classes['legend-item']}>
						<span className={`${classes['legend-dot']} ${classes['legend-dot--selected']}`} />
						Wybrany
					</li>
					<li className={classes['legend-item']}>
						<span className={`${classes['legend-dot']} ${classes['legend-dot--disabled']}`} />
						Niedostępny
					</li>
				</ul>

				<p className={classes['selected-info']}>
					{selectedSector ? (
						<>
							Wybrany sektor: <strong>{selectedSector}</strong>
						</>
					) : (
						'Nie wybrano jeszcze sektora'
					)}
				</p>

				<nav className={classes['hall-nav']}>
					<Link to={nextUrl}>
						<Button className={classes['hall-button']} size='lg' onClick={handleChooseBlocksClick}>
							Wybierz strefę
						</Button>
					</Link>
				</nav>
			</footer>

			<Dialog open={isOpen} onOpenChange={setIsOpen}>
				<DialogContent className='sm:max-w-md'>
					<DialogHeader>
						<DialogTitle>Brak wybranego sektora hali!!!</DialogTitle>
						<DialogDescription>Żeby przejść dalej, musisz najpierw wybrać sektor hali.</DialogDescription>
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

export default Hall;
