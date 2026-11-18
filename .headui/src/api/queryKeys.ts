import type { Event } from '@beatriz/shared/events';
import type { User } from '@beatriz/shared/users';
import type { BlockType } from '@beatriz/shared/tickets';

export const queryKeys = {
	events: {
		all: ['events'] as const,
		list: () => [...queryKeys.events.all, 'list'] as const,
		detail: (id: Event['_id']) => [...queryKeys.events.all, 'detail', id] as const,
	},

	users: {
		all: ['users'] as const,
		list: () => [...queryKeys.users.all, 'list'] as const,
		detail: (id: User['_id']) => [...queryKeys.users.all, 'detail', id] as const,
	},

	favourites: {
		all: ['favourites'] as const,
		list: () => [...queryKeys.favourites.all, 'list'] as const,
	},

	posts: {
		all: ['posts'] as const,
		byEvent: (eventId: Event['_id']) => [...queryKeys.posts.all, eventId] as const,
	},

	orders: {
		all: ['orders'] as const,
		byUser: (userId: User['_id']) => [...queryKeys.orders.all, userId] as const,
	},

	tickets: {
		all: ['tickets'] as const,
		byUser: (userId: User['_id']) => [...queryKeys.tickets.all, userId] as const,
	},

	occupiedSeats: {
		all: ['occupied-seats'] as const,
		bySector: (
			eventId: Event['_id'],
			sector: string,
			block: BlockType,
		) => [...queryKeys.occupiedSeats.all, eventId, sector, block] as const,
	},
} as const;
