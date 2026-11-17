import { Link, useNavigate } from 'react-router-dom';
import classes from './Hall.module.css';
import { useEffect, useState } from 'react';
import useGetEventByIdQuery from '@/api/queries/useGetEventByIdQuery';
import { Button } from '@/components/ui/Button/Button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/Dialog/Dialog';
import Sector from '@/components/Sector/Sector';
import { SECTORS } from '@beatriz/shared/enums/sectors';
import { isSectorAvailable, buildBlocksUrl } from '@/utils/sector';

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
		if (!isSectorAvailable(sector, availableSector)) {
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

	return (
		<main className={classes['hall-page']}>
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

			<nav className={classes['hall-nav']}>
				<Link to={nextUrl}>
					<Button
						className={classes['hall-button']}
						variant='ghost'
						onClick={() => {
							if (!selectedSector) {
								setIsOpen(true);
							}
						}}>
						Wybierz strefę
					</Button>
				</Link>
			</nav>

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
