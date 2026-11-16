import Event from '../models/eventModel.ts';
import { formattedDate, formattedTime } from './formattingDate.ts';

export const ticketsTemplate = async (tickets: any[], order: any): Promise<string> => {
	const ticketRows = await Promise.all(
		tickets.map(async ticket => {
			const { name, date, seatRequired } = await Event.findById(ticket.eventId).select('name date seatRequired');
			return `
                <tr>
                    <td>${ticket.sector}</td>
                    <td>${ticket.block}</td>
                    <td>${ticket.seating}</td>
                    <td>${name} (${formattedDate(date)} ${formattedTime(date)})</td>
                    <td>${ticket.price} ${order.currency}</td>
                </tr>
            `;
		}),
	);

	return `
        <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead>
                <tr>
                    <th>Sektor</th>
                    <th>Strefa</th>
                    <th>Miejsce</th>
                    <th>Wydarzenie</th>
                    <th>Cena</th>
                </tr>
            </thead>
            <tbody>
                ${ticketRows.join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4" style="text-align: right; font-weight: bold;">Łączna kwota:</td>
                    <td>${order.totalAmount} ${order.currency}</td>
                </tr>
            </tfoot>
        </table>
    `;
};
