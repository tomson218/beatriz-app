import { ReactNode } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Navbar />
			<main id='detail'>
				<Outlet />
			</main>
			{children}
			<Toaster position='bottom-right' reverseOrder={false} />
		</>
	);
};

export default LayoutWrapper;
