import app from './app.ts';

process.on('uncaughtException', err => {
	console.log('An exception was not taken. Application terminated.');
	console.log(err.name, err.message);
	process.exit(1);
});

console.log('PORT: ', process.env.PORT);

const port = process.env.PORT || 3000;
export const server = app.listen(port, () => {
	console.log(`Application running on port ${port}...`);
});

process.on('unhandledRejection', err => {
	console.log(err.name, err.message);
	server.close(() => {
		process.exit(1);
	});
});
