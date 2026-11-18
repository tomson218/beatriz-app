import { model } from 'mongoose';
import { eventSchema } from '@beatriz/shared/schemas/eventSchema';

const EventModel = model('Event', eventSchema);

export default EventModel;
