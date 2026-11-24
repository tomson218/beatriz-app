import classes from './Ticket.module.css';
import calendarIcon from '@/assets/svg/calendar-icon.svg';
import chairIcon from '@/assets/svg/chair-icon.svg';
import { formattedDate, formattedTime } from '@/shared/utils/formatting-date';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/Button/Button';
import { getNameBlock, getNameTypeTicket, getBlockBadgeClass } from '@/features/tickets/utils/namingTicket';
import type { TicketDto } from '@beatriz/shared/tickets';
import { ASSET_BASE_URL } from '@/shared/api/apiConfig';

interface TicketProps {
	ticket: TicketDto;
	userEmail: string;
}

const Ticket = ({ ticket, userEmail }: TicketProps) => {
	const eventDate = new Date(ticket.event?.date ?? '');
	const purchasedDate = new Date(ticket.date);

	const { sector, block, seat } = ticket.seating;

	const [isShow, setIsShow] = useState<boolean>(false);

	const qrValue = JSON.stringify({
		id: ticket._id,
		eventName: ticket.event?.name,
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
					<figure className={classes['event-figure']}>
						<img
							className={classes['event-image']}
							src={`${ASSET_BASE_URL}/images/events/${ticket.event?.image}`}
							alt={ticket.event?.name}
						/>
					</figure>
				</header>
				<section className={classes['article-body']}>
					<h2>{ticket.event?.name}</h2>

					<time className={classes['event-date-time']}>
						<img src={calendarIcon} alt='Ikona kalendarza' />
						<span>
							{formattedDate(eventDate)} {formattedTime(eventDate)}
						</span>
					</time>

					<section className={classes['event-seating']}>
						<img src={chairIcon} alt='Ikona krzesła' />
						<p className={classes['seating-row']}>
							<span className={classes.section}>Sektor {sector}</span>
							<span className={getBlockBadgeClass(block, classes)}>{getNameBlock(block)}</span>

							{seat && <span className={classes.seat}>Miejsce {seat}</span>}
						</p>
					</section>

					<section className={classes['details-section']}>
						<Button className='w-full' onClick={() => setIsShow(true)}>
							Pokaż szczegóły biletu
						</Button>
					</section>
				</section>
			</article>

			{isShow && (
				<aside className={classes['modal-backdrop']} onClick={() => setIsShow(false)}>
					<div
						className={classes['modal-overlay']}
						role='dialog'
						aria-modal='true'
						onClick={e => e.stopPropagation()}>
						<Button
							variant='ghost'
							size='icon'
							className={classes['modal-close']}
							onClick={() => setIsShow(false)}
							aria-label='Zamknij'>
							&times;
						</Button>

						<h3 className={classes['modal-title']}>Szczegóły biletu</h3>
						<p className={classes['modal-event']}>{ticket.event?.name}</p>

						<dl className={classes['modal-content']}>
							<div className={classes['modal-row']}>
								<dt>Sektor</dt>
								<dd>{sector}</dd>
							</div>
							<div className={classes['modal-row']}>
								<dt>Strefa</dt>
								<dd>{getNameBlock(block)}</dd>
							</div>

							{seat && (
								<div className={classes['modal-row']}>
									<dt>Miejsce</dt>
									<dd>{seat}</dd>
								</div>
							)}

							<div className={classes['modal-row']}>
								<dt>Typ biletu</dt>
								<dd>{getNameTypeTicket(ticket.type)}</dd>
							</div>
							<div className={classes['modal-row']}>
								<dt>Cena biletu</dt>
								<dd>{ticket.price} PLN</dd>
							</div>
							<div className={classes['modal-row']}>
								<dt>Zakupiono</dt>
								<dd>
									{formattedDate(purchasedDate)} {formattedTime(purchasedDate)}
								</dd>
							</div>
						</dl>

						<figure className={classes['qr-code']}>
							<QRCode size={256} value={qrValue} viewBox={`0 0 256 256`} />
						</figure>
					</div>
				</aside>
			)}
		</section>
	);
};

export default Ticket;
