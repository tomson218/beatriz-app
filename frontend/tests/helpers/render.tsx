import type { ReactElement, ReactNode } from 'react';
import { render, type RenderResult } from '@testing-library/react';
import userEvent, { type UserEvent } from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { OrderContextProvider } from '@/features/orders/context/OrderContext';
import { UserContextProvider } from '@/features/auth/context/UserContext';

interface RenderWithProvidersOptions {
	/** Start URL, e.g. `/hall?eventId=1`. Also set in `window.location`, because some pages read their params from it. */
	route?: string;
	/** Route path for the element under test (default `*`). */
	path?: string;
}

export interface RenderWithProvidersResult extends RenderResult {
	user: UserEvent;
	queryClient: QueryClient;
}

export const createTestQueryClient = (): QueryClient =>
	new QueryClient({
		defaultOptions: {
			queries: { retry: false, gcTime: Infinity },
			mutations: { retry: false },
		},
	});

/** Shows the current router URL so tests can assert navigation. */
const LocationDisplay = () => {
	const location = useLocation();

	return <output data-testid='location'>{`${location.pathname}${location.search}`}</output>;
};

/** Same providers as `main.tsx` and `App.tsx`. jsdom does not load the Google/Facebook SDK scripts, so tests stay offline. */
export const TestProviders = ({ children, queryClient }: { children: ReactNode; queryClient: QueryClient }) => (
	<QueryClientProvider client={queryClient}>
		<GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
			<UserContextProvider>
				<OrderContextProvider>
					<MantineProvider>{children}</MantineProvider>
				</OrderContextProvider>
			</UserContextProvider>
		</GoogleOAuthProvider>
	</QueryClientProvider>
);

/** Renders an element with the app providers (React Query, contexts, Mantine) and an in-memory router. */
export const renderWithProviders = (
	element: ReactElement,
	{ route = '/', path = '*' }: RenderWithProvidersOptions = {},
): RenderWithProvidersResult => {
	window.history.replaceState({}, '', route);
	const queryClient = createTestQueryClient();

	const result = render(
		<TestProviders queryClient={queryClient}>
			<MemoryRouter initialEntries={[route]}>
				<Routes>
					<Route path={path} element={element} />
					{/* Empty route for URLs reached by a redirect (e.g. `/`), so the router does not warn about unmatched routes. */}
					{path !== '*' && <Route path='*' element={null} />}
				</Routes>
				<LocationDisplay />
			</MemoryRouter>
		</TestProviders>,
	);

	return { ...result, user: userEvent.setup(), queryClient };
};
