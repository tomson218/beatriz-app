import { describe, expect, it } from 'vitest';
import { generatePDF } from '../../../utils/pdfGenerator.ts';

describe('generatePDF', () => {
	it('returns a PDF document as a Buffer', async () => {
		const pdf = await generatePDF([
			{
				name: 'Koncert',
				date: new Date('2026-12-01T20:00:00'),
				sector: 'A',
				block: 'blue',
				seating: 12,
				price: 90,
				type: 'normal',
			},
			{ name: 'Koncert', date: null, sector: 'B', block: null, seating: null, price: 45, type: 'child' },
		]);

		const result = {
			isBuffer: Buffer.isBuffer(pdf),
			header: pdf.subarray(0, 5).toString(),
			hasEndMarker: pdf.subarray(-6).toString().includes('%%EOF'),
		};
		const expected = { isBuffer: true, header: '%PDF-', hasEndMarker: true };

		expect(result).toEqual(expected);
	});

	it('generates a document for an empty ticket list', async () => {
		const pdf = await generatePDF([]);

		const result = pdf.subarray(0, 5).toString();
		const expected = '%PDF-';

		expect(result).toBe(expected);
	});
});
