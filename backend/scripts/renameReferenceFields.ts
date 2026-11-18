/**
 * Jednorazowa migracja: przenosi referencje do pól `userId`, `eventId` i `favouriteEventIds`.
 * Można ją uruchomić ponownie: dokumenty już zmigrowane są pomijane.
 */
import mongoose from 'mongoose';
import connectDB from '../database.ts';
import ForumModel from '../modules/posts/posts.model.ts';
import OrderModel from '../modules/orders/orders.model.ts';
import TicketModel from '../modules/tickets/tickets.model.ts';
import UserModel from '../modules/users/users.model.ts';

const MIGRATIONS = [
	{ model: ForumModel, fields: { user: 'userId', event: 'eventId' } },
	{ model: OrderModel, fields: { user: 'userId', event: 'eventId' } },
	{ model: TicketModel, fields: { user: 'userId', event: 'eventId' } },
	{ model: UserModel, fields: { favouriteEvents: 'favouriteEventIds' } },
];

const renameReferenceFields = async (): Promise<void> => {
	for (const { model, fields } of MIGRATIONS) {
		for (const [oldField, newField] of Object.entries(fields)) {
			// Natywna kolekcja omija hooki modelu, więc migracja obejmuje też konta nieaktywne.
			const { modifiedCount } = await model.collection.updateMany(
				{ [oldField]: { $exists: true } },
				{ $rename: { [oldField]: newField } },
			);

			console.log(`${model.collection.name}: ${oldField} -> ${newField} (${modifiedCount})`);
		}
	}
};

await connectDB();

try {
	await renameReferenceFields();
} finally {
	await mongoose.disconnect();
}
