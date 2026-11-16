import { getItemLocalStorage, setItemLocalStorage } from '@/utils/localStorage';
import axios from 'axios';

export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api/v2';
export const ASSET_BASE_URL = import.meta.env.VITE_ASSET_URL ?? 'http://localhost:3000';

const instance = axios.create({
	baseURL: API_URL,
	withCredentials: true,
});

export const refreshAccessToken = async (): Promise<string | null> => {
	const response = await instance.post('/auth/refresh-token');
	const accessToken = response.data?.data?.accessToken;

	if (accessToken) {
		setItemLocalStorage('token', accessToken);
		return accessToken;
	}

	return null;
};

instance.interceptors.request.use(
	function (config: any) {
		if (config.url?.includes('/auth/refresh-token')) {
			return config;
		}

		const token = getItemLocalStorage('token');
		if (token) {
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	function (error: any) {
		return Promise.reject(error);
	},
);

instance.interceptors.response.use(
	function (response: any) {
		return response;
	},
	async function (error: any) {
		const originalRequest = error.config;

		if (error.response?.status === 401 && !originalRequest?._retry) {
			originalRequest._retry = true;

			const newAccessToken = await refreshAccessToken();
			if (newAccessToken) {
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
				return instance(originalRequest);
			}
		}

		return Promise.reject(error);
	},
);

export default instance;
