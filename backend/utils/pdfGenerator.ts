import PDFDocument from 'pdfkit';
import { formattedDate, formattedTime } from './formattingDate.ts';
import { getNameBlock, getNameTypeTicket } from './formattings.ts';

export const generatePDF = async (ticketList: any[]): Promise<unknown> => {
	const doc = new PDFDocument({ margin: 50 });
	let buffers = [];

	doc.on('data', buffers.push.bind(buffers));

	return new Promise((resolve, reject) => {
		doc.on('end', () => {
			const pdfData = Buffer.concat(buffers);
			resolve(pdfData);
		});

		doc.on('error', reject);

		doc.fontSize(25).font('Helvetica-Bold').fillColor('#333333').text('Bilety', { align: 'center' });
		doc.moveDown(2);

		ticketList.forEach((ticket, index) => {
			const startY = doc.y;

			doc.rect(50, startY, 500, 100).strokeColor('#cccccc').lineWidth(1).stroke();

			doc.fontSize(15)
				.font('Helvetica-Bold')
				.fillColor('#007BFF')
				.text(`Bilet ${index + 1}`, 60, startY + 10, { underline: true });

			doc.fontSize(12).font('Helvetica').fillColor('#000000');

			doc.text(`Nazwa: ${ticket.name}`, 60, startY + 40);
			doc.text(`Sector: ${ticket.sector}`, 60, startY + 55);

			doc.text(`Strefa: ${getNameBlock(ticket.block)}`, 60, startY + 70);

			doc.text(`Miejsce: ${ticket.seating}`, 60, startY + 85);

			doc.text(`Cena: ${ticket.price} PLN`, 300, startY + 40);
			doc.text(`Typ: ${getNameTypeTicket(ticket.type)}`, 300, startY + 55);
			doc.text(
				`Data: ${formattedDate(new Date(ticket.date))} ${formattedTime(new Date(ticket.date))}`,
				300,
				startY + 70,
			);

			doc.moveDown(5);
		});

		doc.end();
	});
};
