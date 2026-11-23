import { defineConfig } from 'vitest/config';

// Na Windowsie terminal VS Code potrafi uruchomić proces z małą literą dysku (`c:\...`). Vitest rozwiązuje wtedy
// ścieżki modułów niespójnie (`c:/` vs `C:/`) i `vi.mock` przestaje działać, więc ujednolicamy literę dysku w `root`.
const root = import.meta.dirname.replace(/^[a-z]:/, drive => drive.toUpperCase());

export default defineConfig({
	root,
	test: {
		environment: 'node',
		include: ['tests/**/*.test.ts'],
		exclude: ['node_modules/**'],
		restoreMocks: true,
		env: {
			JWT_SECRET: 'test-access-secret',
			JWT_EXPIRES_IN: '15m',
			STRIPE_SK: 'sk_test_dummy',
			CLIENT_URL: 'http://localhost:5173',
		},
	},
});
