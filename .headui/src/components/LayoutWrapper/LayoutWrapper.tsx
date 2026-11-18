import { ReactNode } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

interface LayoutWrapperProps {
	children: ReactNode;
}

const LayoutWrapper = ({ children }: LayoutWrapperProps) => {
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
