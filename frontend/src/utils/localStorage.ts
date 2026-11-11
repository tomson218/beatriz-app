export const setItemLocalStorage = (key: string, value: any) => {
	return localStorage.setItem(key, JSON.stringify(value));
};

export const getItemLocalStorage = (key: string) => {
	if (localStorage.getItem(key)) {
		return JSON.parse(localStorage.getItem(key));
	} else {
		return null;
	}
};
