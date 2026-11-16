import useAddNewEventMutation from '@/api/mutations/useAddNewEventMutation';
import { useState, useRef } from 'react';
import classes from './AddEvent.module.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import Sector from '@/components/Sector/Sector';
import { EVENT_TYPE_OPTIONS, INITIAL_SECTORS } from '@beatriz/shared/constants';

const AddEvent = () => {
	const { mutate: newEvent } = useAddNewEventMutation();

	const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
	const [selectedType, setSelectedType] = useState<string>('concert');

	const descriptionRef = useRef<HTMLInputElement>(null);
	const dateRef = useRef<HTMLInputElement>(null);
	const starsRef = useRef<HTMLInputElement>(null);
	const imageRef = useRef<HTMLInputElement>(null);
	const seatRequiredRef = useRef<HTMLInputElement>(null);
	const normalRef = useRef<HTMLInputElement>(null);
	const vipRef = useRef<HTMLInputElement>(null);
	const childRef = useRef<HTMLInputElement>(null);
	const nameRef = useRef<HTMLInputElement>(null);

	const isSectorSelected = (sector: string) => selectedSectors.includes(sector);

	const handleSelectSector = (sector: string) => {
		if (isSectorSelected(sector)) {
			setSelectedSectors(prev =>
				prev.filter(selectedSector => selectedSector !== sector).sort(),
			);
		} else {
			setSelectedSectors(prev => [...prev, sector].sort());
		}
	};

	const handleAddEvent = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append('description', descriptionRef.current?.value ?? '');
		formData.append('date', dateRef.current?.value ?? '');
		formData.append('star', starsRef.current?.value ?? '');
		if (imageRef.current?.files?.[0]) {
			formData.append('image', imageRef.current.files[0]);
		}
		formData.append('seatRequired', seatRequiredRef.current?.checked ?? false);
		formData.append('normal', String(normalRef.current?.value ?? '0'));
		formData.append('vip', String(vipRef.current?.value ?? '0'));
		formData.append('child', String(childRef.current?.value ?? '0'));
		formData.append('name', nameRef.current?.value ?? '');
		formData.append('sectors', selectedSectors);
		formData.append('type', selectedType);

		newEvent(formData);
	};

	return (
		<>
			<h1 className={classes.heading}>
				Dodawanie nowego wydarzenia
			</h1>
			<form
				action='/api/events'
				method='post'
				className={`${classes.form} ${classes['form-container']}`}
				encType='multipart/form-data'
				onSubmit={handleAddEvent}>
 			<fieldset className={classes['grid-container']}>
 				<section className={classes['input-group']}>
 					<article>
 						<Label htmlFor='description' className={classes.label}>
 							Opis
 						</Label>

 						<textarea id='description' name='description' className={classes.input} ref={descriptionRef} required></textarea>
 					</article>

 					<article>
 						<Label htmlFor='date' className={classes.label}>
 							Data
 						</Label>
 						<Input type='datetime-local' id='date' name='date' className={classes.input} ref={dateRef} required />
 					</article>
 				</section>

 				<section className={classes['input-group']}>
 					<article className={classes.block}>
 						<Label htmlFor='stars' className={classes.label}>
 							Gwiazdy
 						</Label>
						<Input type='text' id='stars' name='stars' className={classes.input} ref={starsRef} required />
 					</article>

 					<article className={classes.block}>
 						<Label htmlFor='name' className={classes.label}>
 							Nazwa
 						</Label>
						<Input type='text' id='name' name='name' className={classes.input} ref={nameRef} required />
 					</article>
 				</section>

 				<section className={classes['input-group']}>
 					<article className={classes.block}>
 						<Label htmlFor='type'>Typ</Label>
 						<Select value={selectedType} onValueChange={setSelectedType}>
 							<SelectTrigger id='type' className={classes['select-input']}>
 								<SelectValue />
 							</SelectTrigger>
 							<SelectContent>
 								{EVENT_TYPE_OPTIONS.map(({ value, label }) => (
 									<SelectItem key={value} value={value}>
 										{label}
 									</SelectItem>
 								))}
 							</SelectContent>
 						</Select>
 					</article>

 					<article className={classes.block}>
 						<Label htmlFor='image' className={classes.label}>
 							Zdjęcie
 						</Label>
						<Input type='file' id='image' name='image' className={classes.input} ref={imageRef} required />
 					</article>
 				</section>

 			<p className={classes['image-section']}>
 				Wybierz sektory
 			</p>

 				<section className={classes.container}>
 					<figure className={classes['hala-container']}>
 						<div className={classes['hala-grid']}>
 							{INITIAL_SECTORS.map((sectorName, index) => (
 								<Sector
 									key={sectorName}
 									sectorName={sectorName}
 									isSelected={isSectorSelected(sectorName)}
 									isDisabled={false}
 									index={index}
 									onClick={handleSelectSector}
 								/>
 							))}
 							<div className={classes.hala}></div>
 						</div>
 					</figure>
 				</section>

 			<aside className={classes.block}>
 				<Label htmlFor='seatRequired' className={classes['seat-required-label']}>
 					Miejsce siedzące wymagane:
 				</Label>
 				<Input type='checkbox' id='seatRequired' name='seatRequired' ref={seatRequiredRef} />
 			</aside>

 			<h1 className={classes['prices-heading']}>
 				Ceny biletów
 			</h1>

 			<section className={classes['tickets-prices']}>
 				<article>
 					<Label htmlFor='normal' className={classes['price-label']}>
 						Normalny
 					</Label>
 						<Input
							type='number'
							id='normal'
							name='normal'
							className={classes['price-input']}
							ref={normalRef}
							required
						/>
 				</article>

 				<article>
 					<Label htmlFor='vip' className={classes['price-label']}>
 						VIP
 					</Label>
 						<Input
							type='number'
							id='vip'
							name='vip'
							className={classes['price-input']}
							ref={vipRef}
							required
						/>
 				</article>

 				<article>
 					<Label htmlFor='child' className={classes['price-label']}>
 						Dziecięcy
 					</Label>
 						<Input
							type='number'
							id='child'
							name='child'
							className={classes['price-input']}
							ref={childRef}
							required
						/>
 				</article>
 			</section>
 			</fieldset>

 			<footer className={classes['submit-button-container']}>
 				<Button className={classes['submit-button']}>Dodaj</Button>
 			</footer>
			</form>
		</>
	);
};

export default AddEvent;
