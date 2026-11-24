import { hasAnyForumPosts, hasNoForumPosts, isPostAuthor } from '@/features/posts/utils/forum';

describe('hasNoForumPosts / hasAnyForumPosts', () => {
	it.each([
		[[], [true, false]],
		[[{ message: 'Hej' }], [false, true]],
	])('%j -> %j', (posts, expected) => {
		const result = [hasNoForumPosts(posts), hasAnyForumPosts(posts)];

		expect(result).toEqual(expected);
	});
});

describe('isPostAuthor', () => {
	it('returns true for a post of the logged-in user', () => {
		localStorage.setItem('user-id', JSON.stringify('user-1'));

		const result = isPostAuthor('user-1');
		const expected = true;

		expect(result).toBe(expected);
	});

	it('returns false for a post of another user', () => {
		localStorage.setItem('user-id', JSON.stringify('user-1'));

		const result = isPostAuthor('user-2');
		const expected = false;

		expect(result).toBe(expected);
	});

	it('returns false when nobody is logged in', () => {
		const result = isPostAuthor('user-1');
		const expected = false;

		expect(result).toBe(expected);
	});

	it('supports a user id saved as a raw string (legacy format)', () => {
		localStorage.setItem('user-id', 'user-1');

		const result = isPostAuthor('user-1');
		const expected = true;

		expect(result).toBe(expected);
	});
});
