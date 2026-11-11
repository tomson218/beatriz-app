import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useGetUserByIdQuery from '@/api/queries/useGetUserByIdQuery';
import { getItemLocalStorage } from '@/utils/localStorage';

const ProtectedRoutes = ({ children, isRequiredAdmin = false }: { children: ReactNode; isRequiredAdmin?: boolean }) => {
	const token = localStorage.getItem('token');
	const isLoggedIn = !!token;

	const userId = getItemLocalStorage('user-id');
	const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserByIdQuery(userId);

	if (!isLoggedIn) {
		return <Navigate to='/' replace />;
	}

	if (isUserDetailsLoading) {
		return <div>Loading...</div>;
	}

	const isAdmin = userDetails?.role === 'admin';

	if (isRequiredAdmin && !isAdmin) {
		return <Navigate to='/home' replace />;
	}

	return children;
};

export default ProtectedRoutes;
