import { createContext, useState, type Dispatch, type SetStateAction } from 'react';

type OrderItem = {
	id?: number;
	date?: string | Date;
	eventId?: string;
	images?: string[];
	name?: string;
	price?: number;
	seating?: number | string;
	sector?: string;
	block?: string;
	type?: string;
};

const OrderContext = createContext<{
	order: OrderItem[];
	setOrder: Dispatch<SetStateAction<OrderItem[]>>;
	totalPrice: number;
	setTotalPrice: Dispatch<SetStateAction<number>>;
	discountCode: string | number;
	setDiscountCode: Dispatch<SetStateAction<number | string>>;
}>({
	order: [],
	setOrder: () => {},
	totalPrice: 0,
	setTotalPrice: () => {},
	discountCode: '',
	setDiscountCode: () => {},
});

export const OrderContextProvider = ({ children }) => {
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
