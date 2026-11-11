import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useGetEventByIdQuery from '../../api/queries/useGetEventByIdQuery';
import useRemoveEventFromFavouriteMutation from '../../api/mutations/useRemoveEventFromFavouriteMutation';
import useGetFavouriteEventsQuery from '../../api/queries/useGetFavoriteEventsQuery';
import useAddEventToFavouriteMutation from '../../api/mutations/useAddEventToFavouriteMutation';
import classes from './EventDetails.module.css';
import { Button } from '@/components/ui/button';
import { formattedDate, formattedTime } from '@/utils/formatting-date';
import calendarIcon from '../../assets/svg/calendar-icon.svg';

const EventDetails = () => {
	const { eventId } = useParams();

	localStorage.setItem('eventDetails', eventId);

	const { data: eventDetails, isLoading: isEventLoading } = useGetEventByIdQuery(eventId);
	const { data: favouriteEvents, isLoading: isFavouriteEventsLoading, refetch } = useGetFavouriteEventsQuery();

	const { mutate: addEventToFavourite } = useAddEventToFavouriteMutation();
	const { mutate: removeEventFromFavourite } = useRemoveEventFromFavouriteMutation(refetch);

	const [isAddedToFavourite, setIsAddedToFavourite] = useState(false);

	useEffect(() => {
		if (favouriteEvents) {
			const isEventInFavourites = favouriteEvents.findIndex(({ _id }) => _id === eventId) !== -1;

			setIsAddedToFavourite(isEventInFavourites);
		}
	}, [favouriteEvents]);

	const handleAddEventToFavourite = () => {
		setIsAddedToFavourite(true);
		addEventToFavourite(eventId);
	};

	const handleRemoveEventFromFavourite = () => {
		setIsAddedToFavourite(false);
		removeEventFromFavourite(eventId);
	};

	if (isEventLoading || isFavouriteEventsLoading) {
		return <div>Loading...</div>;
	}

	const eventDate = new Date(eventDetails?.date);

	return (
		<>
			<div style={{ backgroundColor: '#f0f0f0', minHeight: '94.4dvh' }}>
				<h1 className={classes.heading}>Szczegóły wydarzenia</h1>

				<section className={classes.card}>
					<div className={classes['image-container']}>
						<img
							src={`http://localhost:3000/images/events/${eventDetails?.image}`}
							alt={eventDetails?.name || 'Event Image'}
						/>
					</div>

					<div className={classes.content}>
						<p style={{}} className={classes['event-title']}>
							{eventDetails.name} - {eventDetails.star.join(', ')}
						</p>
						<div className={classes['event-date']}>
							<img src={calendarIcon} alt='Calendar Icon' />
							<span>
								{formattedDate(eventDate)} {formattedTime(eventDate)}
							</span>
						</div>
						<p className={classes['event-description']}>{eventDetails.description}</p>
						<p className={classes['event-ticket']}>
							Bilety już od:{' '}
							<span className={classes['discount-price']}>{eventDetails.prices.normal} PLN</span>
						</p>
						<div className={classes['action-buttons']}>
							<Button
								onClick={
									isAddedToFavourite ? handleRemoveEventFromFavourite : handleAddEventToFavourite
								}
								style={{ backgroundColor: `${isAddedToFavourite ? '#ff6b6b' : '#4caf50'}` }}>
								{isAddedToFavourite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
							</Button>
							<Button style={{ backgroundColor: '#007BFF' }} asChild>
								<Link to={`/forum/${eventId}`}>Przejdź na forum</Link>
							</Button>
							<Button asChild>
								<Link to={`/hall?eventId=${eventId}`}>Wybierz sektor hali</Link>
							</Button>
						</div>
					</div>
				</section>
			</div>
		</>
	);
};

export default EventDetails;
