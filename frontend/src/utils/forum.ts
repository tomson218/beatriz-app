/**
 * Sprawdza czy lista postów forum jest pusta.
 */
export function hasNoForumPosts(posts: readonly unknown[]): boolean {
	return posts.length === 0;
}

/**
 * Sprawdza czy post należy do zalogowanego użytkownika.
 */
export function isPostAuthor(userPostId: string): boolean {
	const storedUserId = localStorage.getItem('user-id');
	if (!storedUserId) return false;
	return userPostId === JSON.parse(storedUserId);
}
