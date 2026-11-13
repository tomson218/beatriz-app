import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerOptions = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Beatriz API',
			version: '1.0.0',
			description:
				'Dokumentacja endpointów backendu projektu Beatriz. Wszystkie ścieżki są pod prefixem /api/v2.',
		},
		servers: [
			{
				url: 'http://localhost:3000',
				description: 'Lokalny backend',
			},
		],
		tags: [
			{ name: 'Auth', description: 'Rejestracja, logowanie, refresh token i sesja' },
			{ name: 'Users', description: 'Użytkownicy, profil, ulubione eventy i koszyk' },
			{ name: 'Events', description: 'Wydarzenia i zarządzanie nimi' },
			{ name: 'Orders', description: 'Zamówienia i historie użytkownika' },
			{ name: 'Tickets', description: 'Bilety, sektory i zajęte miejsca' },
			{ name: 'Discount Codes', description: 'Kody rabatowe' },
			{ name: 'Forum', description: 'Forum wydarzenia' },
			{ name: 'Payments', description: 'Koszyk i płatności Stripe' },
			{ name: 'Webhook', description: 'Webhook Stripe' },
		],
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
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
			},
		},
		paths: {
			'/api/v2/auth/signup': {
				post: {
					tags: ['Auth'],
					summary: 'Rejestracja użytkownika',
					responses: {
						201: { description: 'Utworzono użytkownika' },
						400: { description: 'Błędne dane wejściowe' },
					},
				},
			},
			'/api/v2/auth/login': {
				post: {
					tags: ['Auth'],
					summary: 'Logowanie użytkownika',
					responses: {
						200: { description: 'Pomyślne logowanie' },
						401: { description: 'Nieprawidłowe dane logowania' },
					},
				},
			},
			'/api/v2/auth/refresh-token': {
				post: {
					tags: ['Auth'],
					summary: 'Odświeżenie access tokena',
					responses: {
						200: { description: 'Nowy access token' },
						401: { description: 'Brak lub nieważny refresh token' },
					},
				},
			},
			'/api/v2/auth/logout': {
				post: {
					tags: ['Auth'],
					summary: 'Wylogowanie użytkownika',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Pomyślnie wylogowano' },
						401: { description: 'Brak autoryzacji' },
					},
				},
			},
			'/api/v2/auth/googleLogin': {
				post: {
					tags: ['Auth'],
					summary: 'Logowanie przez Google',
					responses: {
						200: { description: 'Pomyślne logowanie google' },
						400: { description: 'Nieprawidłowy token Google' },
					},
				},
			},
			'/api/v2/auth/facebookLogin': {
				post: {
					tags: ['Auth'],
					summary: 'Logowanie przez Facebook',
					responses: {
						200: { description: 'Pomyślne logowanie facebook' },
						400: { description: 'Nieprawidłowy token Facebook' },
					},
				},
			},
			'/api/v2/auth/forgetPassword': {
				post: {
					tags: ['Auth'],
					summary: 'Zapomniane hasło',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Wysłano link resetujący hasło' },
						401: { description: 'Brak autoryzacji' },
					},
				},
			},
			'/api/v2/auth/resetPassword/{token}': {
				patch: {
					tags: ['Auth'],
					summary: 'Resetowanie hasła po tokenie',
					parameters: [
						{
							name: 'token',
							in: 'path',
							required: true,
							schema: { type: 'string' },
							description: 'Token resetujący hasło z e-maila',
						},
					],
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Hasło zresetowane' },
						400: { description: 'Niepoprawny token lub dane' },
					},
				},
			},
			'/api/v2/auth/updateMyPassword': {
				patch: {
					tags: ['Auth'],
					summary: 'Aktualizacja bieżącego hasła użytkownika',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Hasło zostało zaktualizowane' },
						401: { description: 'Brak autoryzacji' },
					},
				},
			},
			'/api/v2/users': {
				get: {
					tags: ['Users'],
					summary: 'Pobierz wszystkich użytkowników',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Lista użytkowników' },
						401: { description: 'Brak autoryzacji' },
					},
				},
				post: {
					tags: ['Users'],
					summary: 'Utwórz użytkownika',
					responses: {
						201: { description: 'Użytkownik stworzony' },
						400: { description: 'Błędne dane' },
					},
				},
			},
			'/api/v2/users/{id}': {
				get: {
					tags: ['Users'],
					summary: 'Pobierz użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						200: { description: 'Szczegóły użytkownika' },
						404: { description: 'Użytkownik nie istnieje' },
					},
				},
				delete: {
					tags: ['Users'],
					summary: 'Usuń użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						200: { description: 'Usunięto użytkownika' },
						404: { description: 'Użytkownik nie istnieje' },
					},
				},
			},
			'/api/v2/users/editUser/{id}': {
				patch: {
					tags: ['Users'],
					summary: 'Edytuj użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Zaktualizowano użytkownika' } },
				},
			},
			'/api/v2/users/updateMe': {
				patch: {
					tags: ['Users'],
					summary: 'Zaktualizuj profil bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Zaktualizowano profil' } },
				},
			},
			'/api/v2/users/deleteMe': {
				delete: {
					tags: ['Users'],
					summary: 'Usuń bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Usunięto bieżącego użytkownika' } },
				},
			},
			'/api/v2/users/favourite': {
				get: {
					tags: ['Users'],
					summary: 'Pobierz ulubione eventy użytkownika',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista ulubionych eventów' } },
				},
			},
			'/api/v2/users/addFavourite': {
				post: {
					tags: ['Users'],
					summary: 'Dodaj event do ulubionych',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Dodano do ulubionych' } },
				},
			},
			'/api/v2/users/removeFavourite': {
				delete: {
					tags: ['Users'],
					summary: 'Usuń event z ulubionych',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Usunięto z ulubionych' } },
				},
			},
			'/api/v2/users/addCart': {
				post: {
					tags: ['Users'],
					summary: 'Dodaj produkt do koszyka',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Dodano do koszyka' } },
				},
			},
			'/api/v2/events': {
				get: {
					tags: ['Events'],
					summary: 'Pobierz wszystkie wydarzenia',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista wydarzeń' } },
				},
				post: {
					tags: ['Events'],
					summary: 'Utwórz wydarzenie',
					security: [{ bearerAuth: [] }],
					responses: { 201: { description: 'Wydarzenie utworzone' } },
				},
			},
			'/api/v2/events/{id}': {
				get: {
					tags: ['Events'],
					summary: 'Pobierz wydarzenie po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Szczegóły wydarzenia' } },
				},
				patch: {
					tags: ['Events'],
					summary: 'Zaktualizuj wydarzenie',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Wydarzenie zaktualizowane' } },
				},
				delete: {
					tags: ['Events'],
					summary: 'Usuń wydarzenie',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Wydarzenie usunięte' } },
				},
			},
			'/api/v2/orders': {
				get: {
					tags: ['Orders'],
					summary: 'Pobierz wszystkie zamówienia',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista zamówień' } },
				},
			},
			'/api/v2/orders/users/{id}': {
				get: {
					tags: ['Orders'],
					summary: 'Pobierz zamówienia użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Lista zamówień użytkownika' } },
				},
			},
			'/api/v2/tickets': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz wszystkie bilety',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista biletów' } },
				},
			},
			'/api/v2/tickets/users/{id}': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz bilety użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Lista biletów użytkownika' } },
				},
			},
			'/api/v2/tickets/events/{eventId}/available-sectors': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz dostępne sektory dla wydarzenia',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Lista dostępnych sektorów' } },
				},
			},
			'/api/v2/tickets/events/{eventId}/occupied-seats/{sector}/{block}': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz zajęte miejsca dla sektora i bloku',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } },
						{ name: 'sector', in: 'path', required: true, schema: { type: 'string' } },
						{ name: 'block', in: 'path', required: true, schema: { type: 'string' } },
					],
					responses: { 200: { description: 'Zajęte miejsca' } },
				},
			},
			'/api/v2/discount-codes': {
				get: {
					tags: ['Discount Codes'],
					summary: 'Pobierz wszystkie kody rabatowe',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista kodów rabatowych' } },
				},
				post: {
					tags: ['Discount Codes'],
					summary: 'Dodaj nowy kod rabatowy',
					security: [{ bearerAuth: [] }],
					responses: { 201: { description: 'Kod rabatowy utworzony' } },
				},
			},
			'/api/v2/discount-codes/applyCode': {
				post: {
					tags: ['Discount Codes'],
					summary: 'Zastosuj kod rabatowy',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Kod rabatowy zastosowany' } },
				},
			},
			'/api/v2/forum': {
				get: {
					tags: ['Forum'],
					summary: 'Pobierz wszystkie posty forum',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista postów forum' } },
				},
				post: {
					tags: ['Forum'],
					summary: 'Dodaj nowy post do forum',
					security: [{ bearerAuth: [] }],
					responses: { 201: { description: 'Post dodany' } },
				},
			},
			'/api/v2/forum/events/{eventId}': {
				get: {
					tags: ['Forum'],
					summary: 'Pobierz posty forum dla konkretnego eventu',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Posty dla eventu' } },
				},
			},
			'/api/v2/create-checkout-session': {
				post: {
					tags: ['Payments'],
					summary: 'Utwórz sesję płatności Stripe',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Sesja płatności utworzona' } },
				},
			},
			'/api/v2/webhook': {
				post: {
					tags: ['Webhook'],
					summary: 'Webhook Stripe',
					responses: { 200: { description: 'Webhook odebrany' } },
				},
			},
		},
	},
	apis: [],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const swaggerDocs = (app: any) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
};

export default swaggerDocs;
