import { getItemLocalStorage } from '@/utils/localStorage';
import { createContext, useState } from 'react';

const UserContext = createContext({
	userProgress: '',
	userId: '',
	setUserProgress: () => {},
	setUserId: () => {},
});

export const UserContextProvider = ({ children }) => {
	const [userProgress, setUserProgress] = useState('DZIALA, WIEC ISC JESC');

	const [userId, setUserId] = useState(getItemLocalStorage('user-id') || '');

	const userProgressCtx = {
		userProgress,
		setUserProgress,
		userId,
		setUserId,
	};

	return <UserContext.Provider value={userProgressCtx}>{children}</UserContext.Provider>;
};

export default UserContext;
