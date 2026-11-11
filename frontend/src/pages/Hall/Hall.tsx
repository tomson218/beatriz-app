import { Link, useNavigate } from 'react-router-dom';
import classes from './Hall.module.css';
import { useEffect, useState } from 'react';
import useGetEventByIdQuery from '../../api/queries/useGetEventByIdQuery';
import { Button } from '@/components/ui/button';
import Modal from '../../components/UI/Modal/Modal';
import Sector from '../../components/Sector/Sector';
import { INITIAL_SECTORS } from '@/constants/constants';

const Hall = () => {
	const navigate = useNavigate();
	const currentUrl = `${location.pathname}${location.search}`;
	const params = Object.fromEntries(new URLSearchParams(window.location.search));
	const { eventId, sector } = params;
	const { data: eventDetails, isLoading: isEventLoading } = useGetEventByIdQuery(eventId);
	const [selectedSector, setSelectedSector] = useState(sector ?? '');
	const [availableSector, setAvailableSector] = useState<string[]>([]);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		if (eventDetails) {
			const availableSectors = eventDetails?.sectors ?? [];
			setAvailableSector(availableSectors);
		}
	}, [eventDetails]);

	const handleSelectSector = (sector: string) => {
		if (!availableSector.includes(sector)) {
			return;
		} else {
			setSelectedSector(sector);

			const newUrl = `${location.pathname}?eventId=${eventId}&sector=${sector}`;
			navigate(newUrl, { replace: true });

			localStorage.setItem('sector', selectedSector);
		}
	};

	if (isEventLoading) {
		return <p>Łaadowanie danych...</p>;
	}

	return (
		<div style={{ minHeight: '94.4dvh', backgroundImage: 'linear-gradient(135deg, #f0f0f0, #e0e0e0)' }}>
			<h1
				className={classes.title}
				style={{ fontSize: '3rem', color: '#000', textAlign: 'center', padding: '1rem 1rem 0' }}>
				Wybierz odpowiedni sektor hali
			</h1>
			<div className={classes.container}>
				<div className={classes['hala-container']}>
					<div className={classes['hala-grid']}>
						{INITIAL_SECTORS.map((sectorName, index) => (
							<Sector
								key={sectorName}
								sectorName={sectorName}
								isSelected={selectedSector === sectorName}
								isDisabled={!availableSector.includes(sectorName)}
								index={index}
								onClick={handleSelectSector}
							/>
						))}

						<div className={classes.hala}></div>
					</div>
				</div>
			</div>

			<div style={{ padding: '0 1rem 1rem' }}>
				<Link to={selectedSector !== '' ? `/blocks?eventId=${eventId}&sector=${selectedSector}` : currentUrl}>
					<Button
						style={{ backgroundColor: 'black', color: 'white' }}
						variant='ghost'
						onClick={() => {
							if (selectedSector === '') {
								setIsOpen(true);
							}
						}}>
						Wybierz strefę
					</Button>
				</Link>
			</div>

			{isOpen && (
				<Modal
					title='Brak wybranego sektora hali!!!'
					content='Żeby przejść dalej, musisz najpierw wybrać sektor hali.'
					onClick={() => setIsOpen(false)}
				/>
			)}
		</div>
	);
};

export default Hall;
