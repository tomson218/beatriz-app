import type { EventType } from '../types/events';

export const EVENT_TYPE_OPTIONS: Array<{ value: EventType; label: string }> = [
	{ value: 'concert', label: 'Koncert' },
	{ value: 'theater', label: 'Teatr' },
	{ value: 'opera', label: 'Opera' },
	{ value: 'musical', label: 'Musical' },
	{ value: 'festival', label: 'Festiwal' },
	{ value: 'other', label: 'Inne' },
];
