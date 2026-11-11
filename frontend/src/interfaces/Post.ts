import { User } from './User';
import { Event } from './Event';

export interface Post {
	_id: string;
	message: string;
	date: string;
	user: User;
	event: Event;
}
