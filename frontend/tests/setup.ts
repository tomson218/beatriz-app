import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { server } from './helpers/server';

// Browser APIs that jsdom does not implement but Mantine and Radix (shadcn/ui) components use.
Object.defineProperty(window, 'matchMedia', {
	configurable: true,
	value: (query: string): MediaQueryList =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList,
});

class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}

globalThis.ResizeObserver ??= ResizeObserverStub;
Element.prototype.scrollIntoView ??= () => {};

// React Router 6 warns about upcoming v7 changes (the same warnings show up in the browser). Only those are
// filtered out, so they do not drown out other messages in the test output.
const originalWarn = console.warn;
console.warn = (...args: unknown[]) => {
	const isRouterFutureFlagWarning =
		typeof args[0] === 'string' && args[0].includes('React Router Future Flag Warning');

	if (!isRouterFutureFlagWarning) originalWarn(...args);
};

beforeAll(() => {
	server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
	cleanup();
	server.resetHandlers();
	localStorage.clear();
	sessionStorage.clear();
	window.history.replaceState({}, '', '/');
});

afterAll(() => {
	server.close();
});
