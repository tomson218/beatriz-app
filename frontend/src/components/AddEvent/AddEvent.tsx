import useAddNewEventMutation from '@/api/mutations/useAddNewEventMutation';
import { useState } from 'react';
import classes from './AddEvent.module.css';
import { Button } from '@/components/ui/button';
import Sector from '../../components/Sector/Sector';
import { INITIAL_SECTORS } from '@/constants/constants';

const AddEvent = () => {
	const { mutate: newEvent } = useAddNewEventMutation();

	const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

	const handleSelectSector = (sector: string) => {
		if (selectedSectors.includes(sector)) {
			setSelectedSectors((prevSelectedSectors: any) =>
				prevSelectedSectors.filter((selectedSector: any) => selectedSector !== sector).sort(),
			);
		} else {
			setSelectedSectors((prevSelectedSectors: any) => [...prevSelectedSectors, sector].sort());
		}
	};

	const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('description', e.target.description.value);
		formData.append('date', e.target.date.value);
		formData.append('star', e.target.stars.value);
		formData.append('image', e.target.image.files[0]);
		formData.append('seatRequired', e.target.seatRequired.checked);
		formData.append('normal', +e.target.normal.value);
		formData.append('vip', +e.target.vip.value);
		formData.append('child', +e.target.child.value);
		formData.append('name', e.target.name.value);
		formData.append('sectors', selectedSectors);
		formData.append('type', e.target.type.value);

		newEvent(formData);
	};

	return (
		<>
			<h1
				style={{
					textAlign: 'center',
					letterSpacing: '1px',
					paddingTop: '3rem',
					textTransform: 'uppercase',
					fontWeight: '600',
					fontSize: '1.5rem',
				}}>
				Dodawanie nowego wydarzenia
			</h1>
			<form
				action='/api/events'
				method='post'
				className={`${classes.form} ${classes.formContainer}`}
				encType='multipart/form-data'
				onSubmit={handleAddEvent}>
				<div className={classes.gridContainer}>
					<section className={classes['input-group']}>
						<div>
							<label htmlFor='description' className={classes.label}>
								Opis
							</label>

							<textarea id='description' name='description' className={classes.input} required></textarea>
						</div>

						<div>
							<label htmlFor='date' className={classes.label}>
								Data
							</label>
							<input type='datetime-local' id='date' name='date' className={classes.input} required />
						</div>
					</section>

					<section className={classes['input-group']}>
						<div className={classes.block}>
							<label htmlFor='stars' className={classes.label}>
								Gwiazdy
							</label>
							<input type='text' id='stars' name='stars' className={classes.input} required />
						</div>

						<div className={classes.block}>
							<label htmlFor='stars' className={classes.label}>
								Nazwa
							</label>
							<input type='text' id='name' name='name' className={classes.input} required />
						</div>
					</section>

					<section className={classes['input-group']}>
						<div className={classes.block}>
							<label htmlFor='stars' className={classes.label}>
								Typ
							</label>
							<select
								id='type'
								name='type'
								style={{
									border: '1px solid black',
									padding: '0.5rem 1rem',
									width: '100%',
								}}>
								<option value='concert'>Koncert</option>
								<option value='workshop'>Warsztat</option>
								<option value='conference'>Konferencja</option>
								<option value='festival'>Festiwal</option>
							</select>
						</div>

						<div className={classes.block}>
							<label htmlFor='image' className={classes.label}>
								Zdjęcie
							</label>
							<input type='file' id='image' name='image' className={classes.input} required />
						</div>
					</section>

					<div
						style={{
							marginBottom: '15px',
							margin: '10px',
							fontWeight: 600,
							textAlign: 'center',
							textTransform: 'uppercase',
						}}>
						Wybierz sektory
					</div>

					<div className={classes.container}>
						<div className={classes['hala-container']}>
							<div className={classes['hala-grid']}>
								{INITIAL_SECTORS.map((sectorName, index) => (
									<Sector
										key={sectorName}
										sectorName={sectorName}
										isSelected={selectedSectors.includes(sectorName)}
										isDisabled={false}
										index={index}
										onClick={handleSelectSector}
									/>
								))}
								<div className={classes.hala}></div>
							</div>
						</div>
					</div>

					<div className={classes.block}>
						<label htmlFor='normalny' className={classes.label} style={{ paddingRight: '1rem' }}>
							Miejsce siedzące wymagane:
						</label>
						<input type='checkbox' id={`seatRequired`} name='seatRequired' />
					</div>

					<h1
						style={{
							marginBottom: '15px',
							textAlign: 'center',
							textTransform: 'uppercase',
							fontWeight: '600',
							letterSpacing: '1px',
						}}>
						Ceny biletów
					</h1>

					<section className={classes['tickets-prices']}>
						<div>
							<label
								htmlFor='normal'
								className={classes.label}
								style={{ display: 'flex', justifyContent: 'center' }}>
								Normalny
							</label>
							<input
								type='number'
								id='normal'
								name='normal'
								className={classes.input}
								required
								style={{ display: 'flex', justifyContent: 'center' }}
							/>
						</div>

						<div>
							<label
								htmlFor='vip'
								className={classes.label}
								style={{ display: 'flex', justifyContent: 'center' }}>
								VIP
							</label>
							<input
								type='number'
								id='vip'
								name='vip'
								className={classes.input}
								required
								style={{ width: '100%' }}
							/>
						</div>

						<div>
							<label
								htmlFor='child'
								className={classes.label}
								style={{ display: 'flex', justifyContent: 'center' }}>
								Dziecięcy
							</label>
							<input
								type='number'
								id='child'
								name='child'
								className={classes.input}
								required
								style={{ width: '100%' }}
							/>
						</div>
					</section>
				</div>

				<div className={classes.submitButtonContainer}>
					<Button className={classes.submitButton}>Dodaj</Button>
				</div>
			</form>
		</>
	);
};

export default AddEvent;
