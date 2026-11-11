import { useContext } from 'react';
import OrderContext from '../../context/OrderContext';
import classes from './TotalAmount.module.css';

const TotalAmount = () => {
	const { totalPrice } = useContext(OrderContext);

	return <div className={classes['total-amount']}>Łączna kwota do zapłaty: {totalPrice.toFixed(2)} PLN</div>;
};

export default TotalAmount;
