import classes from './Ticket.module.css';
import calendarIcon from '@/assets/svg/calendar-icon.svg';
import chairIcon from '@/assets/svg/chair-icon.svg';
import { formattedDate, formattedTime } from '@/utils/formatting-date';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getNameBlock, getNameTypeTicket, getBlockBadgeClass } from '@/utils/namingTicket';
import type { Ticket as ITicket } from '@beatriz/shared/tickets';
import { ASSET_BASE_URL } from '@/api/apiConfig';

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
				<div className={classes['article-wrapper']}>
					<figure>
						<img
							className={classes['event-image']}
							src={`${ASSET_BASE_URL}/images/events/${ticket.event.image}`}
							alt={ticket.event.image}
						/>
					</figure>
					<div className={classes['article-body']}>
						<h2>{ticket.event.name}</h2>

						<div className={classes['event-date-time']}>
							<img src={calendarIcon} alt='Calendar Icon' />
							<span>
								{formattedDate(eventDate)} {formattedTime(eventDate)}
							</span>
						</div>

						<div className={classes['event-seating']}>
							<img src={chairIcon} alt='Chair Icon' />
							<div className={classes['seating-row']}>
								<span className={classes.section}>{sector}</span>
								<span className={getBlockBadgeClass(block, classes)}>
									{getNameBlock(block)}
								</span>

								{seat && <span className={classes.seat}>{seat}</span>}
							</div>
						</div>

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
							<div className={classes['modal-overlay']} onClick={() => setIsShow(false)}>
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

								<div className={classes['modal-content']}>
									<p className={classes['modal-row']}>
										<strong>Sektor:</strong> <span>{sector}</span>
									</p>
									<p className={classes['modal-row']}>
										<strong>Strefa:</strong> <span>{getNameBlock(block)}</span>
									</p>

									{seat && (
										<p className={classes['modal-row']}>
											<strong>Miejsce:</strong> <span>{seat}</span>
										</p>
									)}

									<p className={classes['modal-row']}>
										<strong>Typ biletu:</strong> <span>{getNameTypeTicket(ticket.type)}</span>
									</p>
									<p className={classes['modal-row']}>
										<strong>Cena biletu:</strong> <span>{ticket.price} PLN</span>
									</p>
									<p className={classes['modal-row']}>
										<strong>Zakupiono: </strong>
										<span>
											{formattedDate(purchasedDate)} {formattedTime(purchasedDate)}
										</span>
									</p>
								</div>

								<div className={classes['qr-code']}>
									<QRCode
										size={256}
										value={qrValue}
										viewBox={`0 0 256 256`}
										onClick={() => console.log(qrValue)}
									/>
								</div>
							</div>
						)}
					</div>
				</div>
			</article>
		</section>
	);
};

export default Ticket;
