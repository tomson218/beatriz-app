import type { EventType } from '../types/events';

export interface EventTypeOption {
	value: EventType;
	label: string;
}

export const EVENT_TYPE_OPTIONS: EventTypeOption[] = [
	{ value: 'concert', label: 'Koncert' },
	{ value: 'theater', label: 'Teatr' },
	{ value: 'opera', label: 'Opera' },
	{ value: 'musical', label: 'Musical' },
	{ value: 'festival', label: 'Festiwal' },
	{ value: 'other', label: 'Inne' },
];
