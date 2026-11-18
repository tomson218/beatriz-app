import classes from './Ticket.module.css';
import calendarIcon from '@/assets/svg/calendar-icon.svg';
import chairIcon from '@/assets/svg/chair-icon.svg';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { getNameBlock, getNameTypeTicket, getBlockBadgeClass } from '@/features/tickets/utils/namingTicket';
import type { Ticket as ITicket } from '@beatriz/shared/tickets';
import { ASSET_BASE_URL } from '@/shared/api/apiConfig';

interface TicketProps {
	ticket: ITicket;
	userEmail: string;
}

const Ticket = ({ ticket, userEmail }: TicketProps) => {
	const eventDate = new Date(ticket.event?.date);
	const purchasedDate = new Date(ticket.date);

	const { sector, block, seat } = ticket.seating;

	const [isShow, setIsShow] = useState<boolean>(false);

	const qrValue = JSON.stringify({
		id: ticket._id,
		eventName: ticket.event.name,
		date: `${formattedDate(eventDate)} ${formattedTime(eventDate)}`,
		email: userEmail,
		type: ticket.type,
		price: ticket.price,
		sector,
		block,
		seat,
	});

	return (
		<section className={classes['clickable-card']}>
			<article>
				<header className={classes['article-wrapper']}>
					<figure>
						<img
							className={classes['event-image']}
							src={`${ASSET_BASE_URL}/images/events/${ticket.event.image}`}
							alt={ticket.event.image}
						/>
					</figure>
				</header>
				<section className={classes['article-body']}>
					<h2>{ticket.event.name}</h2>

					<time className={classes['event-date-time']}>
						<img src={calendarIcon} alt='Ikona kalendarza' />
						<span>
							{formattedDate(eventDate)} {formattedTime(eventDate)}
						</span>
					</time>

					<section className={classes['event-seating']}>
						<img src={chairIcon} alt='Ikona krzesła' />
						<p className={classes['seating-row']}>
							<span className={classes.section}>{sector}</span>
							<span className={getBlockBadgeClass(block, classes)}>
								{getNameBlock(block)}
							</span>

							{seat && <span className={classes.seat}>{seat}</span>}
						</p>
					</section>

					<section className={classes['details-section']}>
						<Button
							onClick={() => {
								setTimeout(
									setIsShow(prevState => !prevState),
									5000,
								);
							}}>
							{isShow ? 'Ukryj' : 'Pokaż'} szczegóły biletu
						</Button>
					</section>

					{isShow && (
						<aside className={classes['modal-overlay']} onClick={() => setIsShow(false)}>
							<Button
								variant='ghost'
								size='icon'
								className={classes['modal-close']}
								onClick={() => setIsShow(false)}
								aria-label='Zamknij'>
								&times;
							</Button>

							<h3 className={classes['modal-title']}>
								Szczegóły Biletu
							</h3>

							<dl className={classes['modal-content']}>
								<div className={classes['modal-row']}>
									<strong>Sektor:</strong> <span>{sector}</span>
								</div>
								<div className={classes['modal-row']}>
									<strong>Strefa:</strong> <span>{getNameBlock(block)}</span>
								</div>

								{seat && (
									<div className={classes['modal-row']}>
										<strong>Miejsce:</strong> <span>{seat}</span>
									</div>
								)}

								<div className={classes['modal-row']}>
									<strong>Typ biletu:</strong> <span>{getNameTypeTicket(ticket.type)}</span>
								</div>
								<div className={classes['modal-row']}>
									<strong>Cena biletu:</strong> <span>{ticket.price} PLN</span>
								</div>
								<div className={classes['modal-row']}>
									<strong>Zakupiono: </strong>
									<span>
										{formattedDate(purchasedDate)} {formattedTime(purchasedDate)}
									</span>
								</div>
							</dl>

							<figure className={classes['qr-code']}>
								<QRCode
									size={256}
									value={qrValue}
									viewBox={`0 0 256 256`}
									onClick={() => console.log(qrValue)}
								/>
							</figure>
						</aside>
					)}
				</section>
			</article>
		</section>
	);
};

export default Ticket;
