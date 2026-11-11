import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import LayoutWrapper from './components/LayoutWrapper/LayoutWrapper';
import Register from './pages/Register/Register.tsx';
import Login from './pages/Login/Login.tsx';
import OrderSummary from './pages/OrderSummary/OrderSummary.tsx';
import UserProfile from './pages/UserProfile/UserProfile.tsx';
import Home from './pages/Home/Home.tsx';
import FavouriteEvents from './pages/FavouriteEvents/FavouriteEvents.tsx';
import EventDetails from './pages/EventDetails/EventDetails.tsx';
import Faq from './pages/Faq/Faq.tsx';
import Cancel from './pages/Cancel/Cancel.tsx';
import Success from './pages/Success/Success.tsx';
import Error404 from './pages/Error404/Error404.tsx';
import Tickets from './pages/Tickets/Tickets.tsx';
import ForgetPassword from './pages/ForgetPassword/ForgetPassword.tsx';
import ResetPassword from './pages/ResetPassword/ResetPassword.tsx';
import ChangeUserPassword from './pages/ChangeUserPassword/ChangeUserPassword.tsx';
import UpdateUserDetails from './pages/UpdateUserDetails/UpdateUserDetails.tsx';
import EventsCalendar from './pages/EventsCalendar/EventsCalendar.tsx';
import Sectors from './components/Sector/Sector.tsx';
import Seats from './pages/Seats/Seats.tsx';
import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoutes.tsx';
import Hall from './pages/Hall/Hall.tsx';
import UserOrders from './pages/UserOrders/UserOrders.tsx';
import Forum from './pages/Forum/Forum.tsx';
import AdminPanel from './pages/AdminPanel/AdminPanel.tsx';
import Blocks from './pages/Blocks/Blocks.tsx';
import TicketChoice from './pages/TicketChoice/TicketChoice.tsx';

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
		path: '/calendar',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<EventsCalendar />
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
		path: '/forget-password',
		element: (
			<ProtectedRoutes>
				<LayoutWrapper>
					<ForgetPassword />
				</LayoutWrapper>
			</ProtectedRoutes>
		),
	},

	{
		path: '/reset-password/:resetToken',
		element: (
			<LayoutWrapper>
				<ResetPassword />
			</LayoutWrapper>
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
		path: '/change-password',
		element: (
			<LayoutWrapper>
				<ChangeUserPassword />
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
