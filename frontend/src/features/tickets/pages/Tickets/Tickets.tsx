import { useContext, useMemo, useState } from 'react';
import useGetTicketsByUserQuery from '@/features/tickets/api/queries/useGetTicketsByUserQuery';
import Ticket from '@/features/tickets/components/Ticket/Ticket';
import classes from './Tickets.module.css';
import Loader from '@/shared/components/libs/Loader/Loader';
import UserContext, { type UserContextType } from '@/features/auth/context/UserContext';
import useGetUserByIdQuery from '@/features/users/api/queries/useGetUserByIdQuery';
import type { Ticket as ITicket } from '@beatriz/shared/tickets';

type TicketFilter = 'all' | 'upcoming';

const TICKET_FILTERS: { value: TicketFilter; label: string; title: string; empty: string }[] = [
	{ value: 'upcoming', label: 'Nadchodzące', title: 'Nadchodzące bilety', empty: 'Brak nadchodzących biletów' },
	{ value: 'all', label: 'Wszystkie', title: 'Wszystkie bilety', empty: 'Brak zakupionych biletów' },
];

const Tickets = () => {
	const { userId } = useContext<UserContextType>(UserContext);

	const { data: ticketsUser, isLoading: isTicketsUserLoading } = useGetTicketsByUserQuery(userId);

	const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserByIdQuery(userId);

	const [ticketFilter, setTicketFilter] = useState<TicketFilter>('all');

	const tickets = useMemo<ITicket[]>(() => {
		const allTickets: ITicket[] = ticketsUser ?? [];

		if (ticketFilter === 'all') return allTickets;

		const now = new Date();
		return allTickets.filter(ticket => new Date(ticket.event?.date as unknown as string) > now);
	}, [ticketsUser, ticketFilter]);

	const isAnyDataLoading = isTicketsUserLoading || isUserDetailsLoading;

	if (isAnyDataLoading) {
		return <Loader />;
	}

	const hasNoTickets = tickets.length === 0;
	const activeFilter = TICKET_FILTERS.find(({ value }) => value === ticketFilter) ?? TICKET_FILTERS[1];

	return (
		<main>
			<h1 className={classes.title}>{activeFilter.title}</h1>

			<nav className={classes.buttons} aria-label='Filtr biletów'>
				{TICKET_FILTERS.map(({ value, label }) => (
					<button
						key={value}
						type='button'
						className={`${classes['filter-button']} ${ticketFilter === value ? classes.active : ''}`}
						aria-pressed={ticketFilter === value}
						onClick={() => setTicketFilter(value)}>
						{label}
					</button>
				))}
			</nav>

			{hasNoTickets && <p className={classes.empty}>{activeFilter.empty}</p>}

			<section className={classes.tickets}>
				{tickets.map(ticket => (
					<Ticket key={ticket._id} ticket={ticket} userEmail={userDetails.email} />
				))}
			</section>
		</main>
	);
};

export default Tickets;
