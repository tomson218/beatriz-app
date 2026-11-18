/** Zwraca kopię obiektu zawierającą wyłącznie dozwolone pola (allowlista, np. przy aktualizacji profilu). */
export const pickFields = (source: Record<string, unknown>, ...allowedFields: string[]): Record<string, unknown> => {
	const entries = Object.entries(source).filter(([field]) => allowedFields.includes(field));

	return Object.fromEntries(entries);
};
