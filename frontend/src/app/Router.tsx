import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LayoutWrapper from './layout/LayoutWrapper/LayoutWrapper';
import Register from '@/features/auth/pages/Register/Register.tsx';
import Login from '@/features/auth/pages/Login/Login.tsx';
import OrderSummary from '@/features/orders/pages/OrderSummary/OrderSummary.tsx';
import UserProfile from '@/features/users/pages/UserProfile/UserProfile.tsx';
import Home from '@/features/events/pages/Home/Home.tsx';
import FavouriteEvents from '@/features/events/pages/FavouriteEvents/FavouriteEvents.tsx';
import EventDetails from '@/features/events/pages/EventDetails/EventDetails.tsx';
import Faq from '@/features/faq/pages/Faq/Faq.tsx';
import Cancel from '@/features/orders/pages/Cancel/Cancel.tsx';
import Success from '@/features/orders/pages/Success/Success.tsx';
import Error404 from './pages/Error404/Error404.tsx';
import Tickets from '@/features/tickets/pages/Tickets/Tickets.tsx';
import UpdateUserDetails from '@/features/users/pages/UpdateUserDetails/UpdateUserDetails.tsx';

import Sectors from '@/features/tickets/components/Sector/Sector.tsx';
import Seats from '@/features/tickets/pages/Seats/Seats.tsx';
import ProtectedRoutes from '@/features/auth/components/ProtectedRoutes/ProtectedRoutes.tsx';
import Hall from '@/features/tickets/pages/Hall/Hall.tsx';
import UserOrders from '@/features/orders/pages/UserOrders/UserOrders.tsx';
import Forum from '@/features/posts/pages/Forum/Forum.tsx';
import AdminPanel from '@/features/admin/pages/AdminPanel/AdminPanel.tsx';
import Blocks from '@/features/tickets/pages/Blocks/Blocks.tsx';
import TicketChoice from '@/features/tickets/pages/TicketChoice/TicketChoice.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Login />,
	},

	{
		path: '/register',
		element: <Register />,
	},

	{
		path: '/home',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Home />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/favourite',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<FavouriteEvents />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/summary',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<OrderSummary />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/admin-panel',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<AdminPanel />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/faq',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Faq />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/user-profile',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<UserProfile />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/event-details/:eventId',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<EventDetails />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/forum/:eventId',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Forum />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/success',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Success />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/cancel',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Cancel />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/sectors',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Sectors />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/seats',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Seats />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/tickets',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<Tickets />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/update-userdetails',
		element: (
			<LayoutWrapper>
				<UpdateUserDetails />
			</LayoutWrapper>
		),
	},

	{
		path: '/blad',
		element: <Error404 />,
	},

	{
		path: '/hall',
		element: (
			<LayoutWrapper>
				<Hall />
			</LayoutWrapper>
		),
	},
	{
		path: '/user-orders',
		element: (
			<LayoutWrapper>
				<UserOrders />
			</LayoutWrapper>
		),
	},

	{
		path: '/blocks',
		element: (
			<LayoutWrapper>
				<Blocks />
			</LayoutWrapper>
		),
	},

	{
		path: '/ticket-choice',
		element: (
			<LayoutWrapper>
				<TicketChoice />
			</LayoutWrapper>
		),
	},

	{
		path: '*',
		element: <Navigate to='/' replace />,
	},
]);

const Router = () => {
	return <RouterProvider router={router} />;
};

export default Router;
