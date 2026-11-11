import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<GoogleOAuthProvider clientId={googleClientId}>
				<App />
			</GoogleOAuthProvider>
		</QueryClientProvider>
	</React.StrictMode>
);

import.meta.env.VITE_GOOGLE_CLIENT_ID;
