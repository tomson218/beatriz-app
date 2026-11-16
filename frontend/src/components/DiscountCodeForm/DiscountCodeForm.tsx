import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useRef } from 'react';
import useApplyDiscountCodeMutation from '@/api/mutations/useApplyDiscountCodeMutation';
import { useContext } from 'react';
import OrderContext, { type OrderContextType } from '@/context/OrderContext';
import classes from './DiscountCodeForm.module.css';

interface DiscountError {
	message: string;
	visible: boolean;
}

const DiscountCodeForm = () => {
	const { setOrder, totalPrice, setTotalPrice } = useContext<OrderContextType>(OrderContext);

	const discountRef = useRef<HTMLInputElement>(null);

	const [discountPercent, setDiscountPercent] = useState<number>(0);
	const [discountError, setDiscountError] = useState<DiscountError>({
		message: '',
		visible: false,
	});

	const { mutateAsync: applyDiscountCode } = useApplyDiscountCodeMutation();

	const handleSubmitDiscount = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setDiscountError({
			message: '',
			visible: false,
		});

		const enteredCode = discountRef.current.value.trim();

		try {
			const response = await applyDiscountCode({ enteredCode, totalPrice });

			if (response.discount) {
				const discount = response.discount;
				setDiscountPercent(discount);

				setOrder(prevOrder => {
					const updatedOrder = prevOrder.map(item => ({ ...item, price: item.price * (1 - discount) }));
					localStorage.setItem('ORDERS', JSON.stringify(updatedOrder));
					const totalAmount = updatedOrder.reduce((sum, item) => sum + item.price, 0);
					setTotalPrice(totalAmount);
					localStorage.setItem('totalPrice', JSON.stringify(totalAmount));
					localStorage.setItem('code', JSON.stringify(enteredCode));
					return updatedOrder;
				});
			}
		} catch (error) {
			console.error('Error applying discount code:', error);

			if (error.response.status === 400 && error.response.data.message === 'Discount code already applied.') {
				setDiscountError({
					message: 'Kod zniżkowy został już użyty',
					visible: true,
				});
				return;
			} else if (error.response.status === 400) {
				setDiscountError({
					message:
						'Użyty kod jest już nieważny albo wartość zamówienia jest za mała, żeby skorzystać z tego kodu',
					visible: true,
				});
				return;
			} else if (error.response.status === 404) {
				setDiscountError({
					message: 'Użyty kod jest niepoprawny',
					visible: true,
				});
				return;
			}
		}
	};

 return (
		<form onSubmit={handleSubmitDiscount} className={classes.form}>
			<Label htmlFor='discountCode'>
				Podaj kod zniżkowy:
			</Label>
			<Input
				type='text'
				id='discountCode'
				ref={discountRef}
				required
				minLength={5}
			/>
			<Button className={classes.button}>
				Użyj kodu
			</Button>
			{discountError.visible && (
				<p className={classes.error}>{discountError.message}</p>
			)}
	</form>
);
};

export default DiscountCodeForm;
