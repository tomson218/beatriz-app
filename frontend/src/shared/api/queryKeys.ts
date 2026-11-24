import type { EventDto } from '@beatriz/shared/events';
import type { UserDto } from '@beatriz/shared/users';
import type { BlockType } from '@beatriz/shared/tickets';

export const queryKeys = {
	events: {
		all: ['events'] as const,
		list: () => [...queryKeys.events.all, 'list'] as const,
		detail: (id: EventDto['_id']) => [...queryKeys.events.all, 'detail', id] as const,
	},

	users: {
		all: ['users'] as const,
		detail: (id: UserDto['_id']) => [...queryKeys.users.all, 'detail', id] as const,
	},

	favourites: {
		all: ['favourites'] as const,
		list: () => [...queryKeys.favourites.all, 'list'] as const,
	},

	posts: {
		all: ['posts'] as const,
		byEvent: (eventId: EventDto['_id']) => [...queryKeys.posts.all, eventId] as const,
	},

	orders: {
		all: ['orders'] as const,
		byUser: (userId: UserDto['_id']) => [...queryKeys.orders.all, userId] as const,
		pending: () => [...queryKeys.orders.all, 'pending'] as const,
	},

	tickets: {
		all: ['tickets'] as const,
		byUser: (userId: UserDto['_id']) => [...queryKeys.tickets.all, userId] as const,
	},

	occupiedSeats: {
		all: ['occupied-seats'] as const,
		bySector: (eventId: EventDto['_id'], sector: string, block: BlockType) =>
			[...queryKeys.occupiedSeats.all, eventId, sector, block] as const,
	},
} as const;
