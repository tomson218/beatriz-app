import { Card, CardContent, CardFooter } from '@/components/ui/Card/Card';
import classes from './EventCard.module.css';
import { Link } from 'react-router-dom';
import calendarIcon from '@/assets/svg/calendar-icon.svg';
import { checkEventIsNew } from '@/utils/checkEventIsNew';
import { parseEventDate } from '@/utils/eventDate';
import { formattedDate, formattedTime } from '@/utils/formatting-date';
import OutlineHeartIcon from '@/assets/icons/OutlineHeartIcon';
import { useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import type { Event } from '@beatriz/shared/events';
import { ASSET_BASE_URL } from '@/api/apiConfig';

interface EventProps {
	event: Event;
	isFavourite: boolean;
	onAddToFavourite: (id: Event['_id']) => void;
	onRemoveFromFavourite: (id: Event['_id']) => void;
}

const EventCard = ({ event, isFavourite, onAddToFavourite, onRemoveFromFavourite }: EventProps) => {
	const eventDate = parseEventDate(event.date);
	const [isEventFavourite, setIsEventFavourite] = useState<boolean>(isFavourite);
	const isNewEvent = checkEventIsNew(eventDate);

	const handleClickFavourite = (id: Event['_id']): void => {
		const nextValue = !isEventFavourite;
		setIsEventFavourite(nextValue);

		if (nextValue) {
			onAddToFavourite(id);
			return;
		}

		onRemoveFromFavourite(id);
	};

	const favouriteIconClass = `${classes.icon} ${isEventFavourite ? classes.favourite : ''}`;

	return (
		<Card className={classes.container}>
			<CardContent className='p-0'>
				<article className={classes['clickable-card']} aria-label={`Wydarzenie ${event.name}`}>
					<section className={classes['article-wrapper']}>
						{isNewEvent && <span className={classes.label}>NOWE</span>}

						<figure>
							<img
								className={classes['event-image']}
								src={`${ASSET_BASE_URL}/images/events/${event.image}`}
								alt={event.name}
							/>
						</figure>

						<section className={classes['article-body']} aria-labelledby={`event-${event._id}`}>
							<header>
								<h2 id={`event-${event._id}`}>{event.name}</h2>
							</header>

							<ul className={classes['event-stars']} aria-label='Gatunki wydarzenia'>
								{event.star.map((star, index) => (
									<li key={`${star}-${index}`} className={classes['star-badge']}>
										{star}
									</li>
								))}
							</ul>

							<time className={classes['event-date-time']}>
								<img src={calendarIcon} alt='' aria-hidden='true' />
								<span>
									{formattedDate(eventDate)} {formattedTime(eventDate)}
								</span>
							</time>

							<CardFooter className={`${classes['event-actions']} p-0`}>
								<Button asChild type='button'>
									<Link to={`/event-details/${event._id}`}>Szczegóły</Link>
								</Button>

								<Button asChild type='button' variant='secondary'>
									<Link to={`/forum/${event._id}`}>Forum</Link>
								</Button>

								<Button
									type='button'
									variant='ghost'
									size='icon'
									aria-label={isEventFavourite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
									onClick={() => handleClickFavourite(event._id)}
									className={classes.iconButton}>
									<OutlineHeartIcon
										className={favouriteIconClass}
									/>
								</Button>
							</CardFooter>
						</section>
					</section>
				</article>
			</CardContent>
		</Card>
	);
};

export default EventCard;
