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
			'/api/v2/auth/refresh': {
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
			'/api/v2/auth/google': {
				post: {
					tags: ['Auth'],
					summary: 'Logowanie przez Google',
					responses: {
						200: { description: 'Pomyślne logowanie Google' },
						201: { description: 'Utworzono konto przez Google' },
					},
				},
			},
			'/api/v2/auth/facebook': {
				post: {
					tags: ['Auth'],
					summary: 'Logowanie przez Facebook',
					responses: {
						200: { description: 'Pomyślne logowanie Facebook' },
						201: { description: 'Utworzono konto przez Facebook' },
						401: { description: 'Nieprawidłowy token Facebook' },
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
						403: { description: 'Brak uprawnień' },
					},
				},
			},
			'/api/v2/users/me': {
				get: {
					tags: ['Users'],
					summary: 'Pobierz profil bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Profil użytkownika' },
						401: { description: 'Brak autoryzacji' },
					},
				},
				patch: {
					tags: ['Users'],
					summary: 'Zaktualizuj profil bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Profil zaktualizowany' },
						401: { description: 'Brak autoryzacji' },
					},
				},
				delete: {
					tags: ['Users'],
					summary: 'Dezaktywuj konto bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: {
						204: { description: 'Konto dezaktywowane' },
						401: { description: 'Brak autoryzacji' },
					},
				},
			},
			'/api/v2/users/me/cart': {
				put: {
					tags: ['Users'],
					summary: 'Zastąp koszyk bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Koszyk zapisany' } },
				},
			},
			'/api/v2/users/me/favourites': {
				get: {
					tags: ['Users'],
					summary: 'Pobierz ulubione wydarzenia bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista ulubionych wydarzeń' } },
				},
				post: {
					tags: ['Users'],
					summary: 'Dodaj wydarzenie do ulubionych bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: {
						201: { description: 'Dodano do ulubionych' },
						409: { description: 'Wydarzenie jest już w ulubionych' },
					},
				},
			},
			'/api/v2/users/me/favourites/{eventId}': {
				delete: {
					tags: ['Users'],
					summary: 'Usuń wydarzenie z ulubionych bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						204: { description: 'Usunięto z ulubionych' },
						404: { description: 'Wydarzenia nie ma w ulubionych' },
					},
				},
			},
			'/api/v2/users/me/orders': {
				get: {
					tags: ['Orders'],
					summary: 'Pobierz zamówienia bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista zamówień bieżącego użytkownika' } },
				},
			},
			'/api/v2/users/me/tickets': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz bilety bieżącego użytkownika',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista biletów bieżącego użytkownika' } },
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
				patch: {
					tags: ['Users'],
					summary: 'Edytuj użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						200: { description: 'Zaktualizowano użytkownika' },
						404: { description: 'Użytkownik nie istnieje' },
					},
				},
				delete: {
					tags: ['Users'],
					summary: 'Usuń użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						204: { description: 'Usunięto użytkownika' },
						404: { description: 'Użytkownik nie istnieje' },
					},
				},
			},
			'/api/v2/users/{id}/orders': {
				get: {
					tags: ['Orders'],
					summary: 'Pobierz zamówienia użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						200: { description: 'Lista zamówień użytkownika' },
						403: { description: 'Brak uprawnień' },
					},
				},
			},
			'/api/v2/users/{id}/tickets': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz bilety użytkownika po ID',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						200: { description: 'Lista biletów użytkownika' },
						403: { description: 'Brak uprawnień' },
					},
				},
			},
			'/api/v2/events': {
				get: {
					tags: ['Events'],
					summary: 'Pobierz nadchodzące wydarzenia',
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
					responses: {
						200: { description: 'Szczegóły wydarzenia' },
						404: { description: 'Wydarzenie nie istnieje' },
					},
				},
				patch: {
					tags: ['Events'],
					summary: 'Zaktualizuj wydarzenie',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						200: { description: 'Wydarzenie zaktualizowane' },
						404: { description: 'Wydarzenie nie istnieje' },
					},
				},
				delete: {
					tags: ['Events'],
					summary: 'Usuń wydarzenie',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						204: { description: 'Wydarzenie usunięte' },
						404: { description: 'Wydarzenie nie istnieje' },
					},
				},
			},
			'/api/v2/events/{eventId}/posts': {
				get: {
					tags: ['Forum'],
					summary: 'Pobierz posty wydarzenia',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 200: { description: 'Posty wydarzenia' } },
				},
				post: {
					tags: ['Forum'],
					summary: 'Dodaj post do wydarzenia',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
					responses: { 201: { description: 'Post dodany' } },
				},
			},
			'/api/v2/events/{eventId}/availability': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz liczbę wolnych miejsc w sektorach wydarzenia',
					security: [{ bearerAuth: [] }],
					parameters: [{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } }],
					responses: {
						200: { description: 'Wolne miejsca w sektorach' },
						404: { description: 'Wydarzenie nie istnieje' },
					},
				},
			},
			'/api/v2/events/{eventId}/occupied-seats': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz zajęte miejsca w sektorze i strefie',
					security: [{ bearerAuth: [] }],
					parameters: [
						{ name: 'eventId', in: 'path', required: true, schema: { type: 'string' } },
						{ name: 'sector', in: 'query', required: true, schema: { type: 'string' } },
						{ name: 'block', in: 'query', required: true, schema: { type: 'string' } },
					],
					responses: { 200: { description: 'Zajęte miejsca' } },
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
			'/api/v2/tickets': {
				get: {
					tags: ['Tickets'],
					summary: 'Pobierz wszystkie bilety',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista biletów' } },
				},
			},
			'/api/v2/posts': {
				get: {
					tags: ['Forum'],
					summary: 'Pobierz wszystkie posty',
					security: [{ bearerAuth: [] }],
					responses: { 200: { description: 'Lista postów' } },
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
			'/api/v2/discount-codes/apply': {
				post: {
					tags: ['Discount Codes'],
					summary: 'Zastosuj kod rabatowy',
					security: [{ bearerAuth: [] }],
					responses: {
						200: { description: 'Kod rabatowy zastosowany' },
						400: { description: 'Kod wygasł lub wartość zamówienia jest za niska' },
						404: { description: 'Kod nie istnieje' },
						409: { description: 'Kod został już użyty' },
					},
				},
			},
			'/api/v2/checkout-sessions': {
				post: {
					tags: ['Payments'],
					summary: 'Utwórz sesję płatności Stripe',
					security: [{ bearerAuth: [] }],
					responses: { 201: { description: 'Sesja płatności utworzona' } },
				},
			},
			'/api/v2/webhooks/stripe': {
				post: {
					tags: ['Webhook'],
					summary: 'Webhook Stripe',
					responses: {
						200: { description: 'Webhook odebrany' },
						400: { description: 'Nieprawidłowy podpis' },
					},
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
