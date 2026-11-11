import useGetFavouriteEventsQuery from '../../api/queries/useGetFavoriteEventsQuery';
import useRemoveEventFromFavouriteMutation from '../../api/mutations/useRemoveEventFromFavouriteMutation';
import EventCard from '../../components/EventCard/EventCard';
import classes from './FavouirteEvents.module.css';

const FavouriteEvents = () => {
	const { data: favouriteEvents, isLoading: isFavouriteEventsLoading, refetch } = useGetFavouriteEventsQuery();

	const { mutate: removeEventFromFavourite } = useRemoveEventFromFavouriteMutation(refetch);

	const handleRemoveFavouriteEvent = (id: string) => {
		removeEventFromFavourite(id);
	};

	if (isFavouriteEventsLoading) {
		return <div>Loading</div>;
	}

	return (
		<div style={{ backgroundColor: '#ddd', minHeight: '94.4dvh', padding: '2rem 0 0' }}>
			<h1
				style={{
					textAlign: 'center',
					padding: '0 1rem 1rem',
					fontSize: '2rem',
					fontWeight: '600',
					textTransform: 'uppercase',
				}}>
				Oto Twoje ulubione wydarzenia
			</h1>
			<div className={classes.container}>
				{favouriteEvents &&
					favouriteEvents.map(favouriteEvent => (
						<EventCard
							key={favouriteEvent._id}
							event={favouriteEvent}
							onClick={() => handleRemoveFavouriteEvent(favouriteEvent._id)}
							isFavourite
						/>
					))}
			</div>
		</div>
	);
};

export default FavouriteEvents;
