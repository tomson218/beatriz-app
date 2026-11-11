import { createContext, useState } from 'react';

const OrderContext = createContext({
	order: [],
	setOrder: (order = []) => {},
	totalPrice: 0,
	setTotalPrice: (totalPrice = 0) => {},
	discountCode: '',
	setDiscountCode: (discountCode = 0) => {},
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
