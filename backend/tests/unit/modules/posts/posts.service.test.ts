import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import ForumModel from '../../../../modules/posts/posts.model.ts';
import { mockQuery } from '../../../helpers/mockQuery.ts';
import { addPost, findAllPosts, findPostsByEvent } from '../../../../modules/posts/posts.service.ts';

vi.mock('../../../../modules/posts/posts.model.ts', () => ({ default: { find: vi.fn(), create: vi.fn() } }));

const Forum = vi.mocked(ForumModel);
const NOW = new Date('2026-01-01T12:00:00Z');

describe('posts.service', () => {
	beforeEach(() => {
		vi.useFakeTimers({ toFake: ['Date'] });
		vi.setSystemTime(NOW);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('findAllPosts returns posts without the version field', async () => {
		const query = mockQuery(['p1']);
		Forum.find.mockReturnValue(query as never);

		const result = await findAllPosts();
		const expected = ['p1'];

		expect(result).toEqual(expected);
		expect(query.select).toHaveBeenCalledWith('-__v');
	});

	it('findPostsByEvent returns the oldest posts first with author data', async () => {
		const query = mockQuery(['p1']);
		Forum.find.mockReturnValue(query as never);

		const result = await findPostsByEvent('event-1');
		const expected = ['p1'];

		expect(result).toEqual(expected);
		expect(Forum.find).toHaveBeenCalledWith({ eventId: 'event-1' });
		expect(query.populate).toHaveBeenCalledWith('user', 'username email photo');
		expect(query.sort).toHaveBeenCalledWith({ date: 1 });
	});

	it('addPost returns the created post', async () => {
		Forum.create.mockResolvedValue('created' as never);

		const result = await addPost('user-1', 'event-1', 'Hej!');
		const expected = 'created';

		expect(result).toBe(expected);
	});

	it('addPost creates a post dated now', async () => {
		await addPost('user-1', 'event-1', 'Hej!');
		const expected = { userId: 'user-1', eventId: 'event-1', message: 'Hej!', date: NOW.getTime() };

		expect(Forum.create).toHaveBeenCalledWith(expected);
	});
});
