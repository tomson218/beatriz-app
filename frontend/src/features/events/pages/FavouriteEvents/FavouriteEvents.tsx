import useGetFavouriteEventsQuery from '@/features/events/api/queries/useGetFavoriteEventsQuery';
import useRemoveEventFromFavouriteMutation from '@/features/events/api/mutations/useRemoveEventFromFavouriteMutation';
import EventCard from '@/features/events/components/EventCard/EventCard';
import classes from './FavouirteEvents.module.css';

const FavouriteEvents = () => {
	const { data: favouriteEvents, isLoading: isFavouriteEventsLoading, refetch } = useGetFavouriteEventsQuery();
	const { mutate: removeEventFromFavourite } = useRemoveEventFromFavouriteMutation(refetch);

	if (isFavouriteEventsLoading) {
		return <section className={classes.loading}>Loading</section>;
	}

	return (
		<section className={classes.page} aria-labelledby='favourite-events-title'>
			<header className={classes.header}>
				<h1 id='favourite-events-title' className={classes.title}>
					Oto Twoje ulubione wydarzenia
				</h1>
			</header>

			<ul className={classes.list}>
				{favouriteEvents?.map(favouriteEvent => (
					<li key={favouriteEvent._id} className={classes.item}>
						<EventCard
							event={favouriteEvent}
							isFavourite
							onAddToFavourite={() => undefined}
							onRemoveFromFavourite={removeEventFromFavourite}
						/>
					</li>
				))}
			</ul>
		</section>
	);
};

export default FavouriteEvents;
