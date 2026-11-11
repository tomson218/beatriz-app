import { useContext, useEffect, useState } from 'react';
import useGetTicketsByUserQuery from '../../api/queries/useGetTicketsByUserQuery';
import Ticket from '../../components/Ticket/Ticket';
import classes from './Tickets.module.css';
import Loader from '../../components/libs/Loader';
import UserContext from '@/context/UserContext';
import useGetUserByIdQuery from '@/api/queries/useGetUserByIdQuery';
import { Ticket as ITicket } from '../../interfaces/Ticket';

const Tickets = () => {
	const { userId } = useContext(UserContext);

	const { data: ticketsUser, isLoading: isTicketsUserLoading } = useGetTicketsByUserQuery(userId);

	const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserByIdQuery(userId);

	const [tickets, setTickets] = useState([]);

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
		<div style={{ backgroundColor: 'white', minHeight: '94.4dvh' }}>
			<div className={classes.buttons}>
				<button className={classes.upcoming} onClick={handleUpcomingTickets}>
					Nadchodzące
				</button>
				<button className={classes.all} onClick={handleAllTickets}>
					Wszystkie
				</button>
			</div>

			{tickets.length === 0 && <p>Brak zakupionych biletów</p>}

			<div className={classes.tickets} style={{ padding: '20px' }}>
				{tickets.map(ticket => (
					<Ticket key={ticket._id} ticket={ticket} userEmail={userDetails.email} />
				))}
			</div>
		</div>
	);
};

export default Tickets;
