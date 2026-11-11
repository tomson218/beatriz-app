import { Button } from '@/components/ui/button';
import { useState, useRef } from 'react';
import useApplyDiscountCodeMutation from '@/api/mutations/useApplyDiscountCodeMutation';
import { useContext } from 'react';
import OrderContext from '@/context/OrderContext';

const DiscountCodeForm = () => {
	const { setOrder, totalPrice, setTotalPrice } = useContext(OrderContext);

	const discountRef = useRef('');

	const [discountPercent, setDiscountPercent] = useState(0);
	const [discountError, setDiscountError] = useState({
		message: '',
		visible: false,
	});

	const { mutateAsync: applyDiscountCode } = useApplyDiscountCodeMutation();

	const handleSubmitDiscount = async e => {
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
		<>
			<form
				onSubmit={handleSubmitDiscount}
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					padding: '1rem',
					backgroundColor: '#f5f5f5',
					borderRadius: '1rem',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
					maxWidth: '400px',
					margin: '1rem auto 2rem',
				}}>
				<label
					htmlFor='discountCode'
					style={{
						fontSize: '1.2rem',
						fontWeight: '600',
						marginBottom: '0.5rem',
						color: '#333',
					}}>
					Podaj kod zniżkowy:
				</label>
				<input
					type='text'
					id='discountCode'
					ref={discountRef}
					required
					minLength={5}
					style={{
						backgroundColor: '#fff',
						color: '#333',
						padding: '0.75rem',
						borderRadius: '0.5rem',
						border: '1px solid #ccc',
						width: '100%',
						maxWidth: '300px',
						marginBottom: '1rem',
						boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
					}}
				/>
				<Button
					style={{
						padding: '0.75rem 1.5rem',
						backgroundColor: '#ff8c42',
						color: '#fff',
						fontWeight: 'bold',
						border: 'none',
						borderRadius: '0.5rem',
						cursor: 'pointer',
						transition: 'background-color 0.3s',
						marginBottom: '1rem',
					}}
					onMouseEnter={e => (e.target.style.backgroundColor = '#e6762f')}
					onMouseLeave={e => (e.target.style.backgroundColor = '#ff8c42')}>
					Użyj kodu
				</Button>
				{discountError.visible && (
					<p style={{ color: 'red', letterSpacing: '1px', fontWeight: 500 }}>{discountError.message}</p>
				)}
			</form>
		</>
	);
};

export default DiscountCodeForm;
