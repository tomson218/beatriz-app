/**
 * Sprawdza czy lista użytkowników jest pusta.
 */
export function hasNoUsers(users: readonly unknown[]): boolean {
	return users.length === 0;
}

/**
 * Sprawdza czy lista użytkowników zawiera co najmniej jednego użytkownika.
 */
export function hasAnyUsers(users: readonly unknown[]): boolean {
	return !hasNoUsers(users);
}
