import { getItemLocalStorage } from '@/utils/localStorage';
import axios from 'axios';

export const API_URL = 'http://localhost:3000/api';
const instance = axios.create({
	baseURL: API_URL,
});

instance.interceptors.request.use(
	function (config: any) {
		const token = getItemLocalStorage('token');
		config.headers.Authorization = `Bearer ${token}`;
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
	function (error: any) {
		return Promise.reject(error);
	},
);

export default instance;
