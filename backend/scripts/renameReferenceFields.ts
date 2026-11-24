/**
 * One-off migration: moves references to the `userId`, `eventId` and `favouriteEventIds` fields.
 * Safe to run again: documents that are already migrated are skipped.
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

const MIGRATION_STEPS = MIGRATIONS.flatMap(({ model, fields }) =>
	Object.entries(fields).map(([oldField, newField]) => ({ model, oldField, newField })),
);

/** Runs the steps one after another (a promise chain) to avoid loading the database and keep the logs in order. */
const renameReferenceFields = async (): Promise<void> => {
	await MIGRATION_STEPS.reduce(async (previousStep: Promise<void>, { model, oldField, newField }): Promise<void> => {
		await previousStep;

		// The native collection bypasses model hooks, so the migration also covers inactive accounts.
		const { modifiedCount } = await model.collection.updateMany(
			{ [oldField]: { $exists: true } },
			{ $rename: { [oldField]: newField } },
		);

		console.log(`${model.collection.name}: ${oldField} -> ${newField} (${modifiedCount})`);
	}, Promise.resolve());
};

await connectDB();

try {
	await renameReferenceFields();
} finally {
	await mongoose.disconnect();
}
