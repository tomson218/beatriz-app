import { getItemLocalStorage } from '@/shared/utils/localStorage';

/**
 * Sprawdza czy lista postów forum jest pusta.
 */
export function hasNoForumPosts(posts: readonly unknown[]): boolean {
	return posts.length === 0;
}

/**
 * Sprawdza czy lista postów forum zawiera co najmniej jeden post.
 */
export function hasAnyForumPosts(posts: readonly unknown[]): boolean {
	return !hasNoForumPosts(posts);
}

/**
 * Sprawdza czy post należy do zalogowanego użytkownika.
 */
export function isPostAuthor(userPostId: string): boolean {
	const storedUserId = localStorage.getItem('user-id');
	const hasNoStoredUserId = !storedUserId;

	if (hasNoStoredUserId) return false;
	return userPostId === getItemLocalStorage<string>('user-id');
}
