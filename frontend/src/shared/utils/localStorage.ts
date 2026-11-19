export const setItemLocalStorage = <T>(key: string, value: T) => {
	return localStorage.setItem(key, JSON.stringify(value));
};

export const getItemLocalStorage = <T>(key: string): T | null => {
	const item = localStorage.getItem(key);
	if (!item) return null;
	try {
		return JSON.parse(item) as T;
	} catch {
		// Legacy value saved as a raw string (not JSON) - return it as is.
		return item as unknown as T;
	}
};
