import useGetAllEventsQuery from '../../api/queries/useGetAllEventsQuery';
import EventCard from '../../components/EventCard/EventCard';
import classes from './Home.module.css';
import useGetFavouriteEventsQuery from '@/api/queries/useGetFavoriteEventsQuery';
import useAddEventToFavouriteMutation from '../../api/mutations/useAddEventToFavouriteMutation';
import useRemoveEventFromFavouriteMutation from '../../api/mutations/useRemoveEventFromFavouriteMutation';
import { useState } from 'react';
import { calcDatePost } from '@/utils/calcDatePost';

const Home = () => {
	const { data: events, isLoading: isEventsLoading } = useGetAllEventsQuery();

	const { data: favouriteEvents, isLoading: isFavouriteEventsLoading, refetch } = useGetFavouriteEventsQuery();

	const { mutate: addEventToFavourites } = useAddEventToFavouriteMutation(refetch);
	const { mutate: removeEventFromFavourites } = useRemoveEventFromFavouriteMutation(refetch);

	const [filter, setFilter] = useState({
		date: '',
		name: '',
		star: '',
		minPrice: 0,
		maxPrice: 1000,
		type: [],
		seatRequired: [],
	});

	if (isEventsLoading || isFavouriteEventsLoading) {
		return <div>Loading...</div>;
	}

	const handleFilterChange = e => {
		const { name, value } = e.target;
		setFilter(prevFilter => ({
			...prevFilter,
			[name]: name === 'minPrice' || name === 'maxPrice' ? parseInt(value, 10) : value,
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
		.filter(event => {
			const eventDate = new Date(event.date).toISOString().split('T')[0];
			const filterDate = filter.date ? new Date(filter.date).toISOString().split('T')[0] : '';

			return (
				(!filter.date || eventDate === filterDate) &&
				(!filter.name || event.name.toLowerCase().includes(filter.name.toLowerCase())) &&
				(filter.type.length === 0 || filter.type.includes(event.type)) &&
				(!filter.star || event.star.includes(filter.star)) &&
				(filter.seatRequired.length === 0 || filter.seatRequired.includes(event.seatRequired)) &&
				event.prices.normal >= filter.minPrice &&
				event.prices.normal <= filter.maxPrice
			);
		})
		.sort((a, b) => new Date(a.date) - new Date(b.date));

	return (
		<div className={classes.container}>
			<div className={classes['filter-container']}>
				<h3 className={classes['heading-filter']}>Filtrowanie</h3>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<label style={{ marginBottom: '0.5rem', color: '#555' }}>Kategoria wydarzenia</label>
					<div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
						<label>
							<input
								type='checkbox'
								name='type'
								value='concert'
								checked={filter.type.includes('concert')}
								onChange={handleCategoryChange}
							/>
							Koncert
						</label>
						<label>
							<input
								type='checkbox'
								name='type'
								value='workshop'
								checked={filter.type.includes('workshop')}
								onChange={handleCategoryChange}
							/>
							Warsztat
						</label>
						<label>
							<input
								type='checkbox'
								name='type'
								value='conference'
								checked={filter.type.includes('conference')}
								onChange={handleCategoryChange}
							/>
							Konferencja
						</label>
						<label>
							<input
								type='checkbox'
								name='type'
								value='festival'
								checked={filter.type.includes('festival')}
								onChange={handleCategoryChange}
							/>
							Festiwal
						</label>
					</div>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<label htmlFor='star' style={{ marginBottom: '0.5rem', color: '#555' }}>
						Gwiazda wydarzenia
					</label>
					<input
						type='text'
						name='star'
						value={filter.star}
						onChange={handleFilterChange}
						placeholder='Wprowadź gwiazdę'
						style={{
							padding: '0.5rem',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<label htmlFor='minPrice' style={{ marginBottom: '0.5rem', color: '#555' }}>
						Minimalna cena dla biletu normalnego{' '}
						<span style={{ fontWeight: 600 }}>{filter.minPrice} PLN</span>
					</label>
					<input
						type='range'
						name='minPrice'
						value={filter.minPrice}
						onChange={handleFilterChange}
						min='0'
						max='1000'
						placeholder='Wprowadź minimalną cenę'
						style={{
							padding: '0.5rem',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<label htmlFor='maxPrice' style={{ marginBottom: '0.5rem', color: '#555' }}>
						Maksymalna cena dla biletu normalnego{' '}
						<span style={{ fontWeight: 600 }}>{filter.maxPrice} PLN</span>
					</label>
					<input
						type='range'
						name='maxPrice'
						value={filter.maxPrice}
						onChange={handleFilterChange}
						min='0'
						max='1000'
						placeholder='Wprowadź maksymalną cenę'
						style={{
							padding: '0.5rem',
							border: '1px solid #ccc',
							borderRadius: '4px',
						}}
					/>
				</div>

				<div style={{ display: 'flex', flexDirection: 'column' }}>
					<label style={{ marginBottom: '0.5rem', color: '#555' }}>Wymagane miejsce numerowane</label>
					<div style={{ display: 'flex', gap: '1rem' }}>
						<label>
							<input
								type='checkbox'
								name='seatRequired'
								value='true'
								checked={filter.seatRequired.includes(true)}
								onChange={handleSeatRequiredChange}
							/>
							Tak
						</label>
						<label>
							<input
								type='checkbox'
								name='seatRequired'
								value='false'
								checked={filter.seatRequired.includes(false)}
								onChange={handleSeatRequiredChange}
							/>
							Nie
						</label>
					</div>
				</div>
			</div>

			<div className={classes.events} style={{ width: '70%' }}>
				{events &&
					filteredEvents.map(event => (
						<EventCard
							event={event}
							key={event._id}
							isFavourite={favouriteEvents.some(favourite => favourite._id === event._id)}
							addToFavourites={addEventToFavourites}
							removeFromFavourites={removeEventFromFavourites}
						/>
					))}

				{filteredEvents.length === 0 && <p>No events found</p>}
			</div>
		</div>
	);
};

export default Home;
