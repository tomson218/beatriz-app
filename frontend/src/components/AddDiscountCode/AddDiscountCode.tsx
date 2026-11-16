import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';
import useAddDiscountCodeMutation from '@/api/mutations/useAddDiscountCodeMutation';
import classes from './AddDiscountCode.module.css';

const AddDiscountCode = () => {
	const { mutate: addDiscountCode } = useAddDiscountCodeMutation();

	const codeRef = useRef<HTMLInputElement>(null);
	const valueRef = useRef<HTMLInputElement>(null);
	const expirationDateRef = useRef<HTMLInputElement>(null);
	const usageLimitRef = useRef<HTMLInputElement>(null);
	const minAmountOrderRef = useRef<HTMLInputElement>(null);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const code = codeRef.current?.value ?? '';
		const value = parseFloat(valueRef.current?.value ?? '0');
		const expirationDate = expirationDateRef.current?.value ?? '';
		const usageLimit = parseInt(usageLimitRef.current?.value ?? '0', 10);
		const minAmountOrder = parseInt(minAmountOrderRef.current?.value ?? '0', 10);

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
		<form onSubmit={handleSubmit} className={`${classes.form} ${classes['form-container']}`}>
			<fieldset className={classes['grid-container']}>
				<section className={classes['grid-row']}>
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
				</section>

				<section className={classes['grid-row']}>
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
				</section>

				<section className={classes['grid-row']}>
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
				</section>

				<section className={classes['grid-row']}>
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
				</section>

				<section className={classes['grid-row']}>
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
				</section>
			</fieldset>

			<footer className={classes['submit-button-container']}>
				<Button className={classes['submit-button']}>Dodaj</Button>
			</footer>
		</form>
	);
};

export default AddDiscountCode;
