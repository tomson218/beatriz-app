import { model } from 'mongoose';
import { ticketSchemaDef } from '@beatriz/shared/schemas/ticketSchema';

export type { Ticket } from '@beatriz/shared/tickets';

const TicketModel = model('Ticket', ticketSchemaDef);

export default TicketModel;
