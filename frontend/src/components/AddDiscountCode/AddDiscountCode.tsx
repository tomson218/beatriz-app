import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import useAddDiscountCodeMutation from '@/api/mutations/useAddDiscountCodeMutation';
import classes from './AddDiscountCode.module.css';

const AddDiscountCode = () => {
	const { mutate: addDiscountCode } = useAddDiscountCodeMutation();

	const codeRef = useRef('');
	const valueRef = useRef('');
	const expirationDateRef = useRef('');
	const usageLimitRef = useRef('');
	const minAmountOrderRef = useRef('');

	const handleSubmit = e => {
		e.preventDefault();

		const code = codeRef.current?.value;
		const value = +valueRef.current?.value;

		const expirationDate = expirationDateRef.current?.value;
		const usageLimit = +usageLimitRef.current?.value;
		const minAmountOrder = +minAmountOrderRef.current?.value;

		const discountCode = {
			code,
			value,
			expirationDate,
			usageLimit,
			minAmountOrder,
		};

		addDiscountCode(discountCode);
	};

	return (
		<form onSubmit={handleSubmit} className={`${classes.form} ${classes.formContainer}`}>
			<div className={classes.gridContainer}>
				<div className={classes.gridRow}>
					<Label htmlFor='code' className={classes.label}>
						Kod rabatowy
					</Label>
					<Input
						id='code'
						className={classes.input}
						ref={codeRef}
						required
						placeholder='Wprowadź kod rabatowy'
					/>
				</div>

				<div className={classes.gridRow}>
					<Label htmlFor='discountValue' className={classes.label}>
						Wartość kodu rabatowego (w %)
					</Label>
					<Input
						id='discountValue'
						type='number'
						min='0.01'
						max='0.99'
						defaultValue='0.1'
						step={0.01}
						className={classes.input}
						ref={valueRef}
						required
						placeholder='Podaj wartość (np. 0.1)'
					/>
				</div>

				<div className={classes.gridRow}>
					<Label htmlFor='expirationDate' className={classes.label}>
						Data wygaśnięcia
					</Label>
					<Input
						type='datetime-local'
						id='expirationDate'
						className={classes.input}
						ref={expirationDateRef}
						required
					/>
				</div>

				<div className={classes.gridRow}>
					<Label htmlFor='usageLimit' className={classes.label}>
						Liczba limit do wykorzystania
					</Label>
					<Input
						type='number'
						defaultValue='500'
						id='usageLimit'
						className={classes.input}
						ref={usageLimitRef}
						required
						placeholder='Podaj limit wykorzystania'
					/>
				</div>

				<div className={classes.gridRow}>
					<Label htmlFor='minOrderValue' className={classes.label}>
						Minimalna wartość zamówienia
					</Label>
					<Input
						type='number'
						defaultValue='300'
						id='minOrderValue'
						className={classes.input}
						ref={minAmountOrderRef}
						required
						placeholder='Podaj minimalną wartość zamówienia'
					/>
				</div>
			</div>

			<div className={classes.submitButtonContainer}>
				<Button className={classes.submitButton}>Dodaj</Button>
			</div>
		</form>
	);
};

export default AddDiscountCode;
