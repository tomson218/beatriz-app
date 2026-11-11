import Card from '../UI/Card/Card';
import classes from './EventCard.module.css';
import { Link } from 'react-router-dom';
import calendarIcon from '../../assets/svg/calendar-icon.svg';
import { checkEventIsNew } from '@/utils/checkEventIsNew';
import { formattedDate, formattedTime } from './../../utils/formatting-date';
import OutlineHeartIcon from '@/assets/icons/OutlineHeartIcon';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Event } from '../../interfaces/Event';

interface EventProps {
	event: Event;
	isFavourite: boolean;
	addToFavourites: (id: string) => void;
	removeFromFavourites: (id: string) => void;
}

const EventCard = ({ event, isFavourite, addToFavourites, removeFromFavourites }: EventProps) => {
	const eventDate = new Date(event.date);

	const [isEventFavourite, setIsEventFavourite] = useState(isFavourite);

	const handleClickFavourite = (id: string) => {
		if (isEventFavourite) {
			setIsEventFavourite(!isEventFavourite);
			removeFromFavourites(id);
		} else {
			setIsEventFavourite(!isEventFavourite);
			addToFavourites(id);
		}
	};

	const isNewEvent = checkEventIsNew(eventDate);

	return (
		<Card className={classes.container}>
			<div className={classes['clickable-card']}>
				<article>
					<div className={classes['article-wrapper']} style={{ position: 'relative' }}>
						{isNewEvent && <div className={classes.label}>NOWE</div>}

						<figure>
							<img
								className={classes['event-image']}
								src={`http://localhost:3000/images/events/${event.image}`}
								alt={event?.image}
							/>
						</figure>
						<div className={classes['article-body']}>
							<h2>{event.name}</h2>
							<div className={classes['event-stars']}>
								{event?.star.map(s => (
									<span className={classes['star-badge']}>{s}</span>
								))}
							</div>
							<div className={classes['event-date-time']}>
								<img src={calendarIcon} alt='Calendar Icon' />
								<span>
									{formattedDate(eventDate)} {formattedTime(eventDate)}
								</span>
							</div>
							<div className={classes['event-actions']}>
								<Link to={`/event-details/${event._id}`}>
									<Button>Szczegóły</Button>
								</Link>

								<Link to={`/forum/${event._id}`}>
									<Button style={{ backgroundColor: '#007BFF' }}>Forum</Button>
								</Link>

								<OutlineHeartIcon
									onClick={() => handleClickFavourite(event._id)}
									className={`${classes.icon} ${isEventFavourite ? `${classes.favourite}` : ''}`}
								/>
							</div>
						</div>
					</div>
				</article>
			</div>
		</Card>
	);
};

export default EventCard;
