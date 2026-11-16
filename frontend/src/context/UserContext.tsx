import { getItemLocalStorage } from '@/utils/localStorage';
import { createContext, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';

export interface UserContextType {
	userProgress: string;
	userId: string;
	setUserProgress: Dispatch<SetStateAction<string>>;
	setUserId: Dispatch<SetStateAction<string>>;
}

const UserContext = createContext<UserContextType>({
	userProgress: '',
	userId: '',
	setUserProgress: () => {},
	setUserId: () => {},
});

interface UserContextProviderProps {
	children: ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProviderProps) => {
	const [userProgress, setUserProgress] = useState<string>('');

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
