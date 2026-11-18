import { model } from 'mongoose';
import { ticketSchemaDef } from '@beatriz/shared/schemas/ticketSchema';

const TicketModel = model('Ticket', ticketSchemaDef);

export default TicketModel;
