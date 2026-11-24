import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useGetUserByIdQuery from '@/features/users/api/queries/useGetUserByIdQuery';
import { getItemLocalStorage } from '@/shared/utils/localStorage';

interface ProtectedRoutesProps {
	children: ReactNode;
	isRequiredAdmin?: boolean;
}

const ProtectedRoutes = ({ children, isRequiredAdmin = false }: ProtectedRoutesProps) => {
	const token = localStorage.getItem('token');
	const isLoggedIn = !!token;

	const userId = getItemLocalStorage<string>('user-id');
	const { data: userDetails, isLoading: isUserDetailsLoading } = useGetUserByIdQuery(userId);

	const isNotLoggedIn = !isLoggedIn;

	if (isNotLoggedIn) {
		return <Navigate to='/' replace />;
	}

	if (isUserDetailsLoading) {
		return <div>Ładowanie...</div>;
	}

	const isAdmin = userDetails?.role === 'admin';

	const isNotAdmin = !isAdmin;
	const isAdminAccessDenied = isRequiredAdmin && isNotAdmin;

	if (isAdminAccessDenied) {
		return <Navigate to='/home' replace />;
	}

	return children;
};

export default ProtectedRoutes;
