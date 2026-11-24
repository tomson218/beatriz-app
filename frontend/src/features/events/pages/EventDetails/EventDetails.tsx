import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import useGetEventByIdQuery from '@/features/events/api/queries/useGetEventByIdQuery';
import useRemoveEventFromFavouriteMutation from '@/features/events/api/mutations/useRemoveEventFromFavouriteMutation';
import useGetFavouriteEventsQuery from '@/features/events/api/queries/useGetFavoriteEventsQuery';
import useAddEventToFavouriteMutation from '@/features/events/api/mutations/useAddEventToFavouriteMutation';
import classes from './EventDetails.module.css';
import { Button } from '@/shared/components/ui/Button/Button';
import { ASSET_BASE_URL } from '@/shared/api/apiConfig';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import { parseEventDate } from '@/features/events/utils/eventDate';
import calendarIcon from '@/assets/svg/calendar-icon.svg';

const EventDetails = () => {
	const { eventId = '' } = useParams();

	const { data: eventDetails, isLoading: isEventLoading } = useGetEventByIdQuery(eventId);
	const { data: favouriteEvents, isLoading: isFavouriteEventsLoading, refetch } = useGetFavouriteEventsQuery();

	const { mutate: addEventToFavourite } = useAddEventToFavouriteMutation();
	const { mutate: removeEventFromFavourite } = useRemoveEventFromFavouriteMutation(refetch);

	const [isAddedToFavourite, setIsAddedToFavourite] = useState<boolean>(false);

	useEffect(() => {
		localStorage.setItem('eventDetails', eventId);
	}, [eventId]);

	useEffect(() => {
		if (favouriteEvents) {
			const isEventInFavourites = favouriteEvents.findIndex(({ _id }) => _id === eventId) !== -1;

			setIsAddedToFavourite(isEventInFavourites);
		}
	}, [favouriteEvents]);

	const handleToggleFavourite = () => {
		if (isAddedToFavourite) {
			setIsAddedToFavourite(false);
			removeEventFromFavourite(eventId);
		} else {
			setIsAddedToFavourite(true);
			addEventToFavourite(eventId);
		}
	};

	const isAnyDataLoading = isEventLoading || isFavouriteEventsLoading;

	if (isAnyDataLoading) {
		return <div>Ładowanie...</div>;
	}

	if (!eventDetails) {
		return <p>Nie udało się załadować szczegółów wydarzenia.</p>;
	}

	const eventDate = parseEventDate(eventDetails.date);
	const favouriteBtnText = isAddedToFavourite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych';
	const favouriteBtnVariant = isAddedToFavourite ? 'destructive' : 'default';

	return (
		<>
			<main>
				<h1 className={classes.heading}>Szczegóły wydarzenia</h1>

				<section className={classes.card}>
					<figure className={classes['image-container']}>
						<img
							src={`${ASSET_BASE_URL}/images/events/${eventDetails?.image}`}
							alt={eventDetails?.name || 'Event Image'}
						/>
					</figure>

					<article className={classes.content}>
						<p className={classes['event-title']}>
							{eventDetails.name} - {eventDetails.star.join(', ')}
						</p>
						<time className={classes['event-date']}>
							<img src={calendarIcon} alt='Calendar Icon' />
							<span>
								{formattedDate(eventDate)} {formattedTime(eventDate)}
							</span>
						</time>
						<p className={classes['event-description']}>{eventDetails.description}</p>
						<p className={classes['event-ticket']}>
							Bilety już od:{' '}
							<span className={classes['discount-price']}>{eventDetails.prices?.normal} PLN</span>
						</p>
						<nav className={classes['action-buttons']}>
							<Button variant={favouriteBtnVariant} onClick={handleToggleFavourite}>
								{favouriteBtnText}
							</Button>
							<Button variant='secondary' asChild>
								<Link to={`/forum/${eventId}`}>Przejdź na forum</Link>
							</Button>
							<Button asChild>
								<Link to={`/hall?eventId=${eventId}`}>Wybierz sektor hali</Link>
							</Button>
						</nav>
					</article>
				</section>
			</main>
		</>
	);
};

export default EventDetails;
