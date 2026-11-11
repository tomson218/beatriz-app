import { ReactNode } from 'react';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const LayoutWrapper = ({ children }: { children: ReactNode }) => {
	return (
		<>
			<Navbar />
			<div id='detail'>
				<Outlet />
			</div>
			{children}
			<Toaster position='bottom-right' reverseOrder={false} />
		</>
	);
};

export default LayoutWrapper;
