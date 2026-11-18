import { model } from 'mongoose';
import { eventSchema } from '@beatriz/shared/schemas/eventSchema';

export type { Event } from '@beatriz/shared/events';

const EventModel = model('Event', eventSchema);

export default EventModel;
