import { setupServer } from 'msw/node';

/** API base URL the app sends requests to in tests (`VITE_API_URL` in `frontend/.env.test`). */
export const API_URL = 'http://localhost:3000/api/v2';

/** Builds the full URL of an API endpoint, e.g. `apiUrl('/events/:id')`. */
export const apiUrl = (path: string): string => `${API_URL}${path}`;

/**
 * MSW server that intercepts HTTP requests in tests. It has no handlers by default:
 * each test registers its own with `server.use(...)`, and an unhandled request fails the test.
 */
export const server = setupServer();
