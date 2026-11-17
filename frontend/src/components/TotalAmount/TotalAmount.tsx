import { useContext } from 'react';
import OrderContext, { type OrderContextType } from '@/context/OrderContext';
import classes from './TotalAmount.module.css';

const TotalAmount = () => {
	const { totalPrice } = useContext<OrderContextType>(OrderContext);

	return <p className={classes['total-amount']}>Łączna kwota do zapłaty: {totalPrice.toFixed(2)} PLN</p>;
};

export default TotalAmount;
