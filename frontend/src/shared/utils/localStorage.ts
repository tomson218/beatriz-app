export const setItemLocalStorage = <T>(key: string, value: T) => {
	return localStorage.setItem(key, JSON.stringify(value));
};

export const getItemLocalStorage = <T>(key: string): T | null => {
	const item = localStorage.getItem(key);
	if (item) {
		return JSON.parse(item) as T;
	}
	return null;
};
