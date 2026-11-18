import Router from './Router.tsx';
import { OrderContextProvider } from './context/OrderContext.tsx';
import { UserContextProvider } from './context/UserContext.tsx';
import { MantineProvider } from '@mantine/core';

function App() {
	return (
		<>
			<UserContextProvider>
				<OrderContextProvider>
					<MantineProvider>
						<Router />
					</MantineProvider>
				</OrderContextProvider>
			</UserContextProvider>
		</>
	);
}
export default App;
