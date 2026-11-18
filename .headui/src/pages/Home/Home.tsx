import useGetAllEventsQuery from '@/api/queries/useGetAllEventsQuery';
import EventCard from '@/components/EventCard/EventCard';
import classes from './Home.module.css';
import useGetFavouriteEventsQuery from '@/api/queries/useGetFavoriteEventsQuery';
import useAddEventToFavouriteMutation from '@/api/mutations/useAddEventToFavouriteMutation';
import useRemoveEventFromFavouriteMutation from '@/api/mutations/useRemoveEventFromFavouriteMutation';
import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';
import { useState } from 'react';
import { calcDatePost } from '@/utils/calcDatePost';
import { parseEventDate } from '@/utils/eventDate';
import { matchesEventFilter } from '@/utils/eventFilter';
import type { EventFilter } from '@beatriz/shared/events';

const Home = () => {
	const { data: events, isLoading: isEventsLoading } = useGetAllEventsQuery();

	const { data: favouriteEvents, isLoading: isFavouriteEventsLoading, refetch } = useGetFavouriteEventsQuery();

	const { mutate: addEventToFavourites } = useAddEventToFavouriteMutation(refetch);
	const { mutate: removeEventFromFavourites } = useRemoveEventFromFavouriteMutation(refetch);

	const [filter, setFilter] = useState<EventFilter>({
		date: '',
		name: '',
		star: '',
		minPrice: 0,
		maxPrice: 1000,
		type: [],
		seatRequired: [],
	});

	const isAnyDataLoading = isEventsLoading || isFavouriteEventsLoading;

	if (isAnyDataLoading) {
		return <div>Ładowanie...</div>;
	}

	const handleFilterChange = e => {
		const { name, value } = e.target;

		const isMinPriceField = name === 'minPrice';
		const isMaxPriceField = name === 'maxPrice';
		const isPriceField = isMinPriceField || isMaxPriceField;

		setFilter(prevFilter => ({
			...prevFilter,
			[name]: isPriceField ? parseInt(value, 10) : value,
		}));
	};

	const handleCategoryChange = e => {
		const { value, checked } = e.target;

		setFilter(prevFilter => {
			if (checked) {
				return {
					...prevFilter,
					type: [...prevFilter.type, value],
				};
			} else {
				return {
					...prevFilter,
					type: prevFilter.type.filter(cat => cat !== value),
				};
			}
		});
	};

	const handleSeatRequiredChange = e => {
		const { value, checked } = e.target;
		const seatRequiredValue = value === 'true';

		setFilter(prevFilter => {
			if (checked) {
				return {
					...prevFilter,
					seatRequired: [...prevFilter.seatRequired, seatRequiredValue],
				};
			} else {
				return {
					...prevFilter,
					seatRequired: prevFilter.seatRequired.filter(v => v !== seatRequiredValue),
				};
			}
		});
	};

	const filteredEvents = events
		.filter(event => matchesEventFilter(event, filter))
		.toSorted((a, b) => parseEventDate(a.date).getTime() - parseEventDate(b.date).getTime());

	const hasNoFilteredEvents = filteredEvents.length === 0;

	return (
		<main className={classes.container}>
			<aside className={classes['filter-container']}>
				<h3 className={classes['heading-filter']}>Filtrowanie</h3>

				<fieldset className={classes['filter-group']}>
					<legend className={classes['filter-label']}>Kategoria wydarzenia</legend>
					<section className={classes['filter-checkbox-group']}>
						<Label>
							<Input
								type='checkbox'
								name='type'
								value='concert'
								checked={filter.type.includes('concert')}
								onChange={handleCategoryChange}
							/>
							Koncert
						</Label>
						<Label>
							<Input
								type='checkbox'
								name='type'
								value='workshop'
								checked={filter.type.includes('workshop')}
								onChange={handleCategoryChange}
							/>
							Warsztat
						</Label>
						<Label>
							<Input
								type='checkbox'
								name='type'
								value='conference'
								checked={filter.type.includes('conference')}
								onChange={handleCategoryChange}
							/>
							Konferencja
						</Label>
						<Label>
							<Input
								type='checkbox'
								name='type'
								value='festival'
								checked={filter.type.includes('festival')}
								onChange={handleCategoryChange}
							/>
							Festiwal
						</Label>
					</section>
				</fieldset>

				<fieldset className={classes['filter-group']}>
					<Label htmlFor='star'>
						Gwiazda wydarzenia
					</Label>
					<Input
						type='text'
						name='star'
						value={filter.star}
						onChange={handleFilterChange}
						placeholder='Wprowadź gwiazdę'
					/>
				</fieldset>

				<fieldset className={classes['filter-group']}>
					<Label htmlFor='minPrice'>
						Minimalna cena dla biletu normalnego{' '}
						<span className={classes['filter-value']}>{filter.minPrice} PLN</span>
					</Label>
					<Input
						type='range'
						name='minPrice'
						value={filter.minPrice}
						onChange={handleFilterChange}
						min='0'
						max='1000'
					/>
				</fieldset>

				<fieldset className={classes['filter-group']}>
					<Label htmlFor='maxPrice'>
						Maksymalna cena dla biletu normalnego{' '}
						<span className={classes['filter-value']}>{filter.maxPrice} PLN</span>
					</Label>
					<Input
						type='range'
						name='maxPrice'
						value={filter.maxPrice}
						onChange={handleFilterChange}
						min='0'
						max='1000'
					/>
				</fieldset>

				<fieldset className={classes['filter-group']}>
					<legend className={classes['filter-label']}>Wymagane miejsce numerowane</legend>
					<section className={classes['filter-checkbox-row']}>
						<Label>
							<Input
								type='checkbox'
								name='seatRequired'
								value='true'
								checked={filter.seatRequired.includes(true)}
								onChange={handleSeatRequiredChange}
							/>
							Tak
						</Label>
						<Label>
							<Input
								type='checkbox'
								name='seatRequired'
								value='false'
								checked={filter.seatRequired.includes(false)}
								onChange={handleSeatRequiredChange}
							/>
							Nie
						</Label>
					</section>
				</fieldset>
			</aside>

			<section className={classes.events}>
				{events &&
					filteredEvents.map(event => (
						<EventCard
							event={event}
							key={event._id}
							isFavourite={favouriteEvents.some(favourite => favourite._id === event._id)}
							onAddToFavourite={addEventToFavourites}
							onRemoveFromFavourite={removeEventFromFavourites}
						/>
					))}

				{hasNoFilteredEvents && <p>Nie znaleziono wydarzeń</p>}
			</section>
		</main>
	);
};

export default Home;
