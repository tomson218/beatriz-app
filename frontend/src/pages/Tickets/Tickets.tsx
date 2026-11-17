import { useContext, useEffect, useState } from 'react';
import useGetTicketsByUserQuery from '@/api/queries/useGetTicketsByUserQuery';
import Ticket from '@/components/Ticket/Ticket';
import classes from './Tickets.module.css';
import Loader from '@/components/libs/Loader/Loader';
import UserContext, { type UserContextType } from '@/context/UserContext';
import useGetUserByIdQuery from '@/api/queries/useGetUserByIdQuery';
import type { Ticket as ITicket } from '@beatriz/shared/tickets';

const Tickets = () => {
	const { userId } = useContext<UserContextType>(UserContext);

	const { data: ticketsUser, isLoading: isTicketsUserLoading } = useGetTicketsByUserQuery(userId);

	const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserByIdQuery(userId);

	const [tickets, setTickets] = useState<ITicket[]>([]);

	useEffect(() => {
		if (ticketsUser) {
			setTickets(ticketsUser);
		}
	}, [ticketsUser]);

	const handleUpcomingTickets = () => {
		const upcomingEvents = ticketsUser.filter((ticket: ITicket) => {
			const eventDate = new Date(ticket.event?.date as string);
			const currentDate = new Date();
			return eventDate > currentDate;
		});
		setTickets(upcomingEvents);
	};

	const handleAllTickets = () => {
		setTickets(ticketsUser);
	};

	if (isTicketsUserLoading || isUserDetailsLoading) {
		return <Loader />;
	}

	return (
		<main className={classes['tickets-page']}>
			<nav className={classes.buttons}>
				<button className={classes.upcoming} onClick={handleUpcomingTickets}>
					Nadchodzące
				</button>
				<button className={classes.all} onClick={handleAllTickets}>
					Wszystkie
				</button>
			</nav>

			{tickets.length === 0 && <p>Brak zakupionych biletów</p>}

			<section className={classes.tickets}>
				{tickets.map(ticket => (
					<Ticket key={ticket._id} ticket={ticket} userEmail={userDetails.email} />
				))}
			</section>
		</main>
	);
};

export default Tickets;
