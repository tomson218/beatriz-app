/**
 * Sprawdza czy lista użytkowników jest pusta.
 */
export function hasNoUsers(users: readonly unknown[]): boolean {
	return users.length === 0;
}
