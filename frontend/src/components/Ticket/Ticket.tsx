import classes from './Ticket.module.css';
import calendarIcon from '../../assets/svg/calendar-icon.svg';
import chairIcon from '../../assets/svg/chair-icon.svg';
import { formattedDate, formattedTime } from '../../utils/formatting-date.ts';
import QRCode from 'react-qr-code';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getNameBlock, getNameTypeTicket } from '@/utils/namingTicket.ts';
import { Ticket as ITicket } from '@/interfaces/Ticket.ts';

interface TicketProps {
	ticket: ITicket;
	userEmail: string;
}

const Ticket = ({ ticket, userEmail }: TicketProps) => {
	const eventDate = new Date(ticket.event?.date);
	const purchasedDate = new Date(ticket.date);

	const { sector, block, seat } = ticket.seating;

	const [isShow, setIsShow] = useState(false);

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
							src={`http://localhost:3000/images/events/${ticket.event.image}`}
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
							<img src={chairIcon} alt='Calendar Icon' />
							<div style={{ display: 'flex', aligntickets: 'center', flex: 1 }}>
								<span className={classes.section}>{sector}</span>
								<span
									style={{
										backgroundColor:
											block === 'blue'
												? 'blue'
												: block === 'green'
													? 'green'
													: block === 'yellow'
														? 'yellow'
														: 'black',
										padding: '10px',
										border: '1px solid black',
										color: 'white',
										marginLeft: '5px',
									}}>
									{getNameBlock(block)}
								</span>

								{seat && <span className={classes.seat}>{seat}</span>}
							</div>
						</div>

						<section style={{ padding: '2rem .5rem 0' }}>
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
							<div
								style={{
									position: 'fixed',
									top: '50%',
									left: '50%',
									transform: 'translate(-50%, -50%)',
									backgroundColor: '#ffffff',
									border: '1px solid orange',
									width: '400px',
									maxWidth: '90%',
									padding: '2rem',
									borderRadius: '16px',
									boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
									zIndex: 1000,
									fontFamily: 'Roboto',
								}}
								onClick={() => setIsShow(false)}>
								<button
									style={{
										position: 'absolute',
										top: '15px',
										right: '15px',
										backgroundColor: 'transparent',
										border: 'none',
										fontSize: '2rem',
										color: '#ff6347',
										cursor: 'pointer',
										transition: 'color 0.3s ease',
									}}
									onClick={() => setIsShow(false)}
									onMouseEnter={e => (e.target.style.color = '#d32f2f')}
									onMouseLeave={e => (e.target.style.color = '#ff6347')}>
									&times;
								</button>

								<h3
									style={{
										textAlign: 'center',
										marginBottom: '1rem',
										color: '#333',
										fontSize: '1.5rem',
										fontWeight: 600,
										textTransform: 'uppercase',
										letterSpacing: '1px',
									}}>
									Szczegóły Biletu
								</h3>

								<div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
									<p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
										<strong>Sektor:</strong> <span>{sector}</span>
									</p>
									<p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
										<strong>Strefa:</strong> <span>{getNameBlock(block)}</span>
									</p>

									{seat && (
										<p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
											<strong>Miejsce:</strong> <span>{seat}</span>
										</p>
									)}

									<p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
										<strong>Typ biletu:</strong> <span>{getNameTypeTicket(ticket.type)}</span>
									</p>
									<p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
										<strong>Cena biletu:</strong> <span>{ticket.price} PLN</span>
									</p>
									<p style={{ marginBottom: '1rem', fontSize: '1.1rem', color: '#555' }}>
										<strong>Zakupiono: </strong>
										<span>
											{formattedDate(purchasedDate)} {formattedTime(purchasedDate)}
										</span>
									</p>
								</div>

								<div className={classes['qr-code']}>
									<QRCode
										size={256}
										style={{
											width: '100%',
											maxWidth: '300px',
											margin: '0 auto',
											borderRadius: '8px',
										}}
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
