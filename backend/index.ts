/* 

ADDING RELATIVE PATHS IN IMPORTS IN TYPESCRIPT 6.0.3 WITH NODENEXT MODULE SYSTEM

*/

import app from './app.ts';
import connectDB from './database.ts';

process.on('uncaughtException', (err: Error) => {
	console.log('An exception was not taken. Application terminated.');
	console.log(err.name, err.message);
	process.exit(1);
});

// Connect to MongoDB database
await connectDB();

const port = process.env.PORT || 3000;
export const server = app.listen(port, () => {
	console.log(`Application running on port ${port}...`);
});

process.on('unhandledRejection', (err: Error) => {
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
