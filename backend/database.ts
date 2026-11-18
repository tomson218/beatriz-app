import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
	try {
		const dbUri = process.env.DATABASE;
		if (!dbUri) {
			throw new Error('DATABASE environment variable is not defined.');
		}

		const DATABASE = dbUri.replace('<PASSWORD>', process.env.DATABASE_PASSWORD || '');

		await mongoose.connect(DATABASE);
		console.log('DB connection successful!');
	} catch (err) {
		console.error('DB connection failed:', err);
		process.exit(1);
	}
};

export default connectDB;
