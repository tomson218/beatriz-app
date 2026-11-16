import { createContext, useState, type Dispatch, type SetStateAction, type ReactNode } from 'react';
import type { CartTicket } from '@beatriz/shared/orders';

export interface OrderContextType {
	order: CartTicket[];
	setOrder: Dispatch<SetStateAction<CartTicket[]>>;
	totalPrice: number;
	setTotalPrice: Dispatch<SetStateAction<number>>;
	discountCode: string | number;
	setDiscountCode: Dispatch<SetStateAction<number | string>>;
}

const OrderContext = createContext<OrderContextType>({
	order: [],
	setOrder: () => {},
	totalPrice: 0,
	setTotalPrice: () => {},
	discountCode: '',
	setDiscountCode: () => {},
});

interface OrderContextProviderProps {
	children: ReactNode;
}

export const OrderContextProvider = ({ children }: OrderContextProviderProps) => {
	const [order, setOrder] = useState(JSON.parse(localStorage.getItem('ORDERS')) || []);
	const [totalPrice, setTotalPrice] = useState(JSON.parse(localStorage.getItem('totalPrice')) || 0);
	const [discountCode, setDiscountCode] = useState(0);

	const orderCtx = {
		order,
		setOrder,
		totalPrice,
		setTotalPrice,
		discountCode,
		setDiscountCode,
	};

	return <OrderContext.Provider value={orderCtx}>{children}</OrderContext.Provider>;
};

export default OrderContext;
