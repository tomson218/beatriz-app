import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import type { Express } from 'express';

/*
 * OpenAPI documentation served by Swagger UI at /api-docs.
 * Every endpoint that reads a request body has a `requestBody` with a ready-to-send example,
 * so it can be tested straight from the browser with "Try it out".
 */

const EXAMPLE_EVENT_ID = '6712bb5ae030df46e2e18e66';
const EXAMPLE_USER_ID = '6712bb5ae030df46e2e18e67';
const EXAMPLE_ORDER_ID = '6712bb5ae030df46e2e18e68';

const secured = { security: [{ bearerAuth: [] }] };

const pathParam = (name: string, example: string) => ({
	name,
	in: 'path',
	required: true,
	schema: { type: 'string' },
	example,
});

const jsonBody = (schema: object, example: object) => ({
	required: true,
	content: { 'application/json': { schema, example } },
});

const ref = (name: string) => ({ $ref: `#/components/schemas/${name}` });

const responses = (entries: Record<number, string>) =>
	Object.fromEntries(Object.entries(entries).map(([status, description]) => [status, { description }]));

const UNAUTHORIZED = { 401: 'Not logged in (missing or invalid access token)' };
const FORBIDDEN = { 403: 'The logged-in user does not have the required role' };

const cartTicketExample = { eventId: EXAMPLE_EVENT_ID, type: 'normal', sector: 'A', block: 'blue', seating: '12' };

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Beatriz API',
			version: '1.0.0',
			description: [
				'Documentation of the Beatriz backend endpoints. All paths are under the /api/v2 prefix.',
				'',
				'**How to test protected endpoints:**',
				'1. Call `POST /api/v2/auth/login` with "Try it out".',
				'2. Copy `data.accessToken` from the response.',
				'3. Click **Authorize** (top right), paste the token and confirm.',
				'',
				'Endpoints marked with a role (e.g. *admin*) also require a user with that role.',
			].join('\n'),
		},
		servers: [{ url: `http://localhost:${process.env.PORT ?? 3000}`, description: 'Local backend' }],
		tags: [
			{ name: 'Auth', description: 'Sign-up, login, refresh token and session' },
			{ name: 'Users', description: 'Users, profile, favourite events and cart' },
			{ name: 'Events', description: 'Events and their management' },
			{ name: 'Orders', description: 'Orders and order history' },
			{ name: 'Tickets', description: 'Tickets, sectors and occupied seats' },
			{ name: 'Discount Codes', description: 'Discount codes' },
			{ name: 'Forum', description: 'Event forum' },
			{ name: 'Payments', description: 'Stripe checkout' },
			{ name: 'Webhook', description: 'Stripe webhook' },
		],
		components: {
			securitySchemes: {
				bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
			},
			schemas: {
				ErrorResponse: {
					type: 'object',
					properties: {
						status: { type: 'string', example: 'fail' },
						message: { type: 'string', example: 'Access requires a login. Please log in.' },
					},
				},
				SuccessResponse: {
					type: 'object',
					properties: {
						status: { type: 'string', example: 'success' },
						data: { type: 'object', nullable: true },
					},
				},
				AuthResponse: {
					type: 'object',
					properties: {
						status: { type: 'string', example: 'success' },
						data: {
							type: 'object',
							properties: {
								accessToken: { type: 'string', description: 'JWT to paste into "Authorize"' },
								user: { type: 'object' },
							},
						},
					},
				},
				CartTicket: {
					type: 'object',
					required: ['eventId', 'type', 'sector', 'block'],
					properties: {
						eventId: { type: 'string' },
						type: { type: 'string', enum: ['normal', 'VIP', 'child'] },
						sector: { type: 'string', description: 'Hall sector, A-T' },
						block: { type: 'string', enum: ['blue', 'green', 'yellow', 'black'] },
						seating: {
							type: 'string',
							description: 'Seat number 1-100; empty for events without numbered seats',
						},
					},
				},
				CheckoutRequest: {
					type: 'object',
					required: ['products'],
					description: 'Prices are always calculated by the server; only what is being bought is sent.',
					properties: {
						products: { type: 'array', minItems: 1, maxItems: 20, items: ref('CartTicket') },
						discountCode: { type: 'string' },
					},
				},
				ProfileUpdate: {
					type: 'object',
					properties: {
						username: { type: 'string' },
						email: { type: 'string', format: 'email' },
						firstName: { type: 'string' },
						lastName: { type: 'string' },
					},
				},
				DiscountCodeRequest: {
					type: 'object',
					required: ['code', 'value', 'expiration', 'usageLimit', 'usageConditions'],
					properties: {
						code: { type: 'string' },
						value: { type: 'number', description: 'Discount as a fraction, e.g. 0.2 = -20%' },
						expiration: { type: 'string', format: 'date-time' },
						usageLimit: { type: 'number' },
						usageConditions: { type: 'number', description: 'Minimum order value in PLN' },
					},
				},
			},
		},
		paths: {
			'/api/v2/auth/signup': {
				post: {
					tags: ['Auth'],
					summary: 'Register a user',
					requestBody: jsonBody(
						{
							type: 'object',
							required: ['username', 'firstName', 'lastName', 'email', 'password', 'passwordConfirm'],
							properties: {
								username: { type: 'string' },
								firstName: { type: 'string' },
								lastName: { type: 'string' },
								email: { type: 'string', format: 'email' },
								password: { type: 'string', minLength: 8 },
								passwordConfirm: { type: 'string' },
							},
						},
						{
							username: 'jan.test',
							firstName: 'Jan',
							lastName: 'Testowy',
							email: 'jan.test@example.com',
							password: 'test-password-1',
							passwordConfirm: 'test-password-1',
						},
					),
					responses: {
						201: {
							description: 'User created',
							content: { 'application/json': { schema: ref('AuthResponse') } },
						},
						400: { description: 'Invalid input' },
					},
				},
			},
			'/api/v2/auth/login': {
				post: {
					tags: ['Auth'],
					summary: 'Log in with email and password',
					requestBody: jsonBody(
						{
							type: 'object',
							required: ['email', 'password'],
							properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } },
						},
						{ email: 'jan.test@example.com', password: 'test-password-1' },
					),
					responses: {
						200: {
							description: 'Logged in; copy `data.accessToken` into "Authorize"',
							content: { 'application/json': { schema: ref('AuthResponse') } },
						},
						400: { description: 'Email or password missing' },
						401: { description: 'Incorrect email or password' },
					},
				},
			},
			'/api/v2/auth/refresh': {
				post: {
					tags: ['Auth'],
					summary: 'Get a new access token (uses the httpOnly refreshToken cookie)',
					responses: responses({ 200: 'New access token', 401: 'Missing or invalid refresh token' }),
				},
			},
			'/api/v2/auth/logout': {
				post: {
					tags: ['Auth'],
					summary: 'Log out',
					...secured,
					responses: responses({ 200: 'Logged out', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/auth/google': {
				post: {
					tags: ['Auth'],
					summary: 'Log in with Google',
					requestBody: jsonBody(
						{
							type: 'object',
							required: ['authCode'],
							properties: {
								authCode: { type: 'string', description: 'Google ID token (JWT credential)' },
							},
						},
						{ authCode: '<google-id-token>' },
					),
					responses: responses({ 200: 'Logged in with Google', 201: 'Account created with Google' }),
				},
			},
			'/api/v2/auth/facebook': {
				post: {
					tags: ['Auth'],
					summary: 'Log in with Facebook',
					requestBody: jsonBody(
						{
							type: 'object',
							required: ['tokens', 'userProfile'],
							properties: { tokens: { type: 'object' }, userProfile: { type: 'object' } },
						},
						{
							tokens: {
								accessToken: '<facebook-access-token>',
								userID: '1234567890',
								data_access_expiration_time: 1893456000,
							},
							userProfile: {
								id: '1234567890',
								email: 'jan.test@example.com',
								name: 'Jan Testowy',
								picture: { data: { url: 'https://example.com/photo.jpg' } },
							},
						},
					),
					responses: responses({
						200: 'Logged in with Facebook',
						201: 'Account created with Facebook',
						401: 'Invalid Facebook token',
					}),
				},
			},
			'/api/v2/users': {
				get: {
					tags: ['Users'],
					summary: 'Get all users (admin)',
					...secured,
					responses: responses({ 200: 'List of users', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
			},
			'/api/v2/users/me': {
				get: {
					tags: ['Users'],
					summary: 'Get the current user profile',
					...secured,
					responses: responses({ 200: 'User profile', ...UNAUTHORIZED }),
				},
				patch: {
					tags: ['Users'],
					summary: 'Update the current user profile (password and role cannot be changed here)',
					...secured,
					requestBody: jsonBody(ref('ProfileUpdate'), { firstName: 'Jan', lastName: 'Kowalski' }),
					responses: responses({ 200: 'Profile updated', ...UNAUTHORIZED }),
				},
				delete: {
					tags: ['Users'],
					summary: 'Deactivate the current user account',
					...secured,
					responses: responses({ 204: 'Account deactivated', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/users/me/cart': {
				put: {
					tags: ['Users'],
					summary: 'Replace the current user cart',
					...secured,
					requestBody: jsonBody(
						{
							type: 'object',
							required: ['cart'],
							properties: { cart: { type: 'array', items: ref('CartTicket') } },
						},
						{ cart: [cartTicketExample] },
					),
					responses: responses({ 200: 'Cart saved', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/users/me/favourites': {
				get: {
					tags: ['Users'],
					summary: 'Get favourite events of the current user',
					...secured,
					responses: responses({ 200: 'Favourite events', ...UNAUTHORIZED }),
				},
				post: {
					tags: ['Users'],
					summary: 'Add an event to favourites',
					...secured,
					requestBody: jsonBody(
						{ type: 'object', required: ['eventId'], properties: { eventId: { type: 'string' } } },
						{ eventId: EXAMPLE_EVENT_ID },
					),
					responses: responses({
						201: 'Added to favourites',
						409: 'The event is already a favourite',
						...UNAUTHORIZED,
					}),
				},
			},
			'/api/v2/users/me/favourites/{eventId}': {
				delete: {
					tags: ['Users'],
					summary: 'Remove an event from favourites',
					...secured,
					parameters: [pathParam('eventId', EXAMPLE_EVENT_ID)],
					responses: responses({
						204: 'Removed from favourites',
						404: 'The event is not a favourite',
						...UNAUTHORIZED,
					}),
				},
			},
			'/api/v2/users/me/orders': {
				get: {
					tags: ['Orders'],
					summary: 'Get orders of the current user',
					...secured,
					responses: responses({ 200: 'Orders of the current user', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/users/me/tickets': {
				get: {
					tags: ['Tickets'],
					summary: 'Get tickets of the current user (without tickets waiting for an offline payment)',
					...secured,
					responses: responses({ 200: 'Tickets of the current user', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/users/{id}': {
				get: {
					tags: ['Users'],
					summary: 'Get a user by ID (the user themself or admin)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_USER_ID)],
					responses: responses({ 200: 'User details', 404: 'User not found', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
				patch: {
					tags: ['Users'],
					summary: 'Edit a user by ID, including the role (admin)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_USER_ID)],
					requestBody: jsonBody(
						{
							allOf: [
								ref('ProfileUpdate'),
								{
									type: 'object',
									properties: { role: { type: 'string', enum: ['user', 'worker', 'admin'] } },
								},
							],
						},
						{ role: 'worker' },
					),
					responses: responses({ 200: 'User updated', 404: 'User not found', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
				delete: {
					tags: ['Users'],
					summary: 'Delete a user by ID (admin)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_USER_ID)],
					responses: responses({ 204: 'User deleted', 404: 'User not found', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
			},
			'/api/v2/users/{id}/orders': {
				get: {
					tags: ['Orders'],
					summary: 'Get orders of a user (the user themself or admin)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_USER_ID)],
					responses: responses({ 200: 'Orders of the user', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
			},
			'/api/v2/users/{id}/tickets': {
				get: {
					tags: ['Tickets'],
					summary: 'Get tickets of a user (the user themself, admin or worker)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_USER_ID)],
					responses: responses({ 200: 'Tickets of the user', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
			},
			'/api/v2/events': {
				get: {
					tags: ['Events'],
					summary: 'Get upcoming events (prices include the time-based discount or surcharge)',
					...secured,
					responses: responses({ 200: 'Upcoming events', ...UNAUTHORIZED }),
				},
				post: {
					tags: ['Events'],
					summary: 'Create an event (admin, worker)',
					...secured,
					requestBody: {
						required: true,
						content: {
							'multipart/form-data': {
								schema: {
									type: 'object',
									required: [
										'name',
										'date',
										'description',
										'type',
										'sectors',
										'child',
										'normal',
										'vip',
									],
									properties: {
										name: { type: 'string', example: 'Summer Rock Concert' },
										date: {
											type: 'string',
											format: 'date-time',
											example: '2027-07-15T20:00:00.000Z',
										},
										description: { type: 'string', example: 'An evening of live rock music.' },
										type: {
											type: 'string',
											enum: ['concert', 'theater', 'opera', 'musical', 'festival', 'other'],
										},
										seatRequired: { type: 'boolean', example: true },
										star: {
											type: 'string',
											description: 'Comma-separated list of performers',
											example: 'Kortez, Mrozu',
										},
										sectors: {
											type: 'string',
											description: 'Comma-separated list of sectors',
											example: 'A, B, C',
										},
										child: { type: 'number', example: 50 },
										normal: { type: 'number', example: 100 },
										vip: { type: 'number', example: 300 },
										image: { type: 'string', format: 'binary' },
									},
								},
							},
						},
					},
					responses: responses({ 201: 'Event created', 400: 'Invalid price', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
			},
			'/api/v2/events/{id}': {
				get: {
					tags: ['Events'],
					summary: 'Get an event by ID',
					...secured,
					parameters: [pathParam('id', EXAMPLE_EVENT_ID)],
					responses: responses({ 200: 'Event details', 404: 'Event not found', ...UNAUTHORIZED }),
				},
				patch: {
					tags: ['Events'],
					summary: 'Update the event description (admin, worker)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_EVENT_ID)],
					requestBody: jsonBody(
						{ type: 'object', required: ['description'], properties: { description: { type: 'string' } } },
						{ description: 'Updated description.' },
					),
					responses: responses({
						200: 'Event updated',
						404: 'Event not found',
						...UNAUTHORIZED,
						...FORBIDDEN,
					}),
				},
				delete: {
					tags: ['Events'],
					summary: 'Delete an event (admin, worker)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_EVENT_ID)],
					responses: responses({
						204: 'Event deleted',
						404: 'Event not found',
						...UNAUTHORIZED,
						...FORBIDDEN,
					}),
				},
			},
			'/api/v2/events/{eventId}/posts': {
				get: {
					tags: ['Forum'],
					summary: 'Get the forum posts of an event (oldest first)',
					...secured,
					parameters: [pathParam('eventId', EXAMPLE_EVENT_ID)],
					responses: responses({ 200: 'Forum posts', ...UNAUTHORIZED }),
				},
				post: {
					tags: ['Forum'],
					summary: 'Add a post to the event forum',
					...secured,
					parameters: [pathParam('eventId', EXAMPLE_EVENT_ID)],
					requestBody: jsonBody(
						{ type: 'object', required: ['message'], properties: { message: { type: 'string' } } },
						{ message: 'Who else is going?' },
					),
					responses: responses({ 201: 'Post added', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/events/{eventId}/availability': {
				get: {
					tags: ['Tickets'],
					summary: 'Get the number of free seats in each sector of an event',
					...secured,
					parameters: [pathParam('eventId', EXAMPLE_EVENT_ID)],
					responses: responses({ 200: 'Free seats per sector', 404: 'Event not found', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/events/{eventId}/occupied-seats': {
				get: {
					tags: ['Tickets'],
					summary: 'Get occupied seats in a sector zone (including seats reserved for offline payment)',
					...secured,
					parameters: [
						pathParam('eventId', EXAMPLE_EVENT_ID),
						{ name: 'sector', in: 'query', required: true, schema: { type: 'string' }, example: 'A' },
						{
							name: 'block',
							in: 'query',
							required: true,
							schema: { type: 'string', enum: ['blue', 'green', 'yellow', 'black'] },
							example: 'blue',
						},
					],
					responses: responses({ 200: 'Occupied seat numbers, sorted', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/orders': {
				get: {
					tags: ['Orders'],
					summary: 'Get orders, optionally filtered by status (admin)',
					...secured,
					parameters: [
						{
							name: 'status',
							in: 'query',
							required: false,
							schema: { type: 'string', enum: ['pending', 'paid', 'rejected', 'expired'] },
						},
					],
					responses: responses({ 200: 'Orders', 400: 'Invalid status', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
				post: {
					tags: ['Orders'],
					summary: 'Place an order with offline payment (expires if unpaid after 48 hours)',
					...secured,
					requestBody: jsonBody(ref('CheckoutRequest'), { products: [cartTicketExample] }),
					responses: responses({
						201: 'Order waiting for payment confirmation',
						400: 'Invalid products',
						409: 'A seat is already taken',
						...UNAUTHORIZED,
					}),
				},
			},
			'/api/v2/orders/{id}': {
				patch: {
					tags: ['Orders'],
					summary: 'Approve or reject an offline payment (admin)',
					...secured,
					parameters: [pathParam('id', EXAMPLE_ORDER_ID)],
					requestBody: jsonBody(
						{
							type: 'object',
							required: ['status'],
							properties: { status: { type: 'string', enum: ['paid', 'rejected'] } },
						},
						{ status: 'paid' },
					),
					responses: responses({
						200: 'Decision saved',
						400: 'Invalid status',
						404: 'Order not found',
						409: 'The order is not waiting for an offline payment',
						...UNAUTHORIZED,
						...FORBIDDEN,
					}),
				},
			},
			'/api/v2/tickets': {
				get: {
					tags: ['Tickets'],
					summary: 'Get all tickets (admin, worker)',
					...secured,
					responses: responses({ 200: 'All tickets', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
			},
			'/api/v2/posts': {
				get: {
					tags: ['Forum'],
					summary: 'Get all forum posts',
					...secured,
					responses: responses({ 200: 'All posts', ...UNAUTHORIZED }),
				},
			},
			'/api/v2/discount-codes': {
				get: {
					tags: ['Discount Codes'],
					summary: 'Get all discount codes (admin)',
					...secured,
					responses: responses({ 200: 'Discount codes', ...UNAUTHORIZED, ...FORBIDDEN }),
				},
				post: {
					tags: ['Discount Codes'],
					summary: 'Create a discount code (admin)',
					...secured,
					requestBody: jsonBody(ref('DiscountCodeRequest'), {
						code: 'PROMO20',
						value: 0.2,
						expiration: '2027-12-31T23:59:59.000Z',
						usageLimit: 100,
						usageConditions: 100,
					}),
					responses: responses({
						201: 'Discount code created',
						400: 'Negative value',
						...UNAUTHORIZED,
						...FORBIDDEN,
					}),
				},
			},
			'/api/v2/discount-codes/apply': {
				post: {
					tags: ['Discount Codes'],
					summary: 'Apply a discount code to the current order',
					...secured,
					requestBody: jsonBody(
						{
							type: 'object',
							required: ['enteredCode', 'totalPrice'],
							properties: {
								enteredCode: { type: 'string' },
								totalPrice: { type: 'number', description: 'Current order value in PLN' },
							},
						},
						{ enteredCode: 'PROMO20', totalPrice: 150 },
					),
					responses: responses({
						200: 'Discount applied; returns the discount as a fraction',
						400: 'The code has expired or the order value is too low',
						404: 'The code does not exist',
						409: 'The code has already been used',
						...UNAUTHORIZED,
					}),
				},
			},
			'/api/v2/checkout-sessions': {
				post: {
					tags: ['Payments'],
					summary: 'Create a Stripe checkout session and get its URL',
					...secured,
					requestBody: jsonBody(ref('CheckoutRequest'), {
						products: [cartTicketExample],
						discountCode: 'PROMO20',
					}),
					responses: responses({
						201: 'Checkout session created',
						400: 'Invalid products',
						409: 'A seat is already taken',
						...UNAUTHORIZED,
					}),
				},
			},
			'/api/v2/webhooks/stripe': {
				post: {
					tags: ['Webhook'],
					summary: 'Stripe webhook (called by Stripe, requires a valid Stripe-Signature header)',
					responses: responses({ 200: 'Webhook received', 400: 'Invalid signature' }),
				},
			},
		},
	},
	apis: [],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app: Express): void => {
	app.use(
		'/api-docs',
		swaggerUi.serve,
		swaggerUi.setup(swaggerSpec, { explorer: true, swaggerOptions: { persistAuthorization: true } }),
	);
};

export default swaggerDocs;
