import { Button } from '@/shared/components/ui/Button/Button';
import { Input } from '@/shared/components/ui/Input/Input';
import { Label } from '@/shared/components/ui/Label/Label';
import { useState, useRef } from 'react';
import useApplyDiscountCodeMutation from '@/features/discountCodes/api/mutations/useApplyDiscountCodeMutation';
import { useContext } from 'react';
import OrderContext, { type OrderContextType } from '@/features/orders/context/OrderContext';
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

			const discount = response.data?.discount;
			const hasDiscount = !!discount;

			if (hasDiscount) {
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

			const isBadRequest = error.response?.status === 400;
			const isCodeAlreadyApplied = error.response?.status === 409;
			const isCodeNotFound = error.response?.status === 404;

			if (isCodeAlreadyApplied) {
				setDiscountError({
					message: 'Kod zniżkowy został już użyty',
					visible: true,
				});
				return;
			} else if (isBadRequest) {
				setDiscountError({
					message:
						'Użyty kod jest już nieważny albo wartość zamówienia jest za mała, żeby skorzystać z tego kodu',
					visible: true,
				});
				return;
			} else if (isCodeNotFound) {
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
			<Label htmlFor='discountCode' className={classes.label}>
				Podaj kod zniżkowy:
			</Label>
			<Input
				type='text'
				id='discountCode'
				ref={discountRef}
				required
				minLength={5}
			/>
			<Button type='submit'>
				Użyj kodu
			</Button>
			{discountError.visible && (
				<p className={classes.error}>{discountError.message}</p>
			)}
		</form>
	);
};

export default DiscountCodeForm;
