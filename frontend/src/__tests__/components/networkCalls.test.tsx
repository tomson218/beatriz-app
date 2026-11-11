import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useSignUpUserMutation from '@/api/mutations/useSignUpUserMutation';
import { vi } from 'vitest';
import useGetUserOrdersQuery from '@/api/queries/useGetUserOrdersQuery';

vi.mock('@/api/mutations/useLoginUserMutation', async importOriginal => {
	const originalModule = await importOriginal();
	return {
		...originalModule,
		default: vi.fn(() => ({
			mutate: vi.fn(),
		})),
	};
});

vi.mock('@/api/mutations/useSignUpUserMutation', async importOriginal => {
	const originalModule = await importOriginal();
	return {
		...originalModule,
		default: vi.fn(() => ({
			mutate: vi.fn(),
		})),
	};
});

vi.mock('react', () => {
	const originalReact = vi.importActual('react');
	return { ...originalReact, useRef: vi.fn(() => ({ current: { focus: vi.fn() } })) };
});

const wrapper = () => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
			},
		},
	});
	return ({ children }: { children: any }) => (
		<MemoryRouter>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</MemoryRouter>
	);
};

describe('API REQUESTS', () => {
	it('Get orders of user', async () => {
		const { result } = renderHook(() => useGetUserOrdersQuery('6712bb5ae030df46e2e18e66'), {
			wrapper: wrapper(),
		});

		await waitFor(() => {
			expect(result.current.isSuccess).toBeDefined();
		});
	});

	it('Sign up user', async () => {
		const { result } = renderHook(() => useSignUpUserMutation(), {
			wrapper: wrapper(),
		});

		const mockUser = {
			email: 'bvb1909@gmail.com',
			firstName: 'Marco',
			lastName: 'Reus',
			password: 'marco19121909',
			passwordConfirm: 'marco19121909',
			username: 'marco1909',
		};

		act(() => {
			result.current.mutate(mockUser);
		});

		await waitFor(() => {
			expect(result.current.mutate).toHaveBeenCalledTimes(1);
		});
	});
});
