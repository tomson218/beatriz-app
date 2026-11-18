import { Input } from '@/components/ui/Input/Input';
import { Label } from '@/components/ui/Label/Label';
import { Button } from '@/components/ui/Button/Button';
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
					<Label htmlFor='code'>
						Kod rabatowy
					</Label>
					<Input
						id='code'
						ref={codeRef}
						required
						placeholder='Wprowadź kod rabatowy'
					/>
				</section>

				<section className={classes['grid-row']}>
					<Label htmlFor='discountValue'>
						Wartość kodu rabatowego (w %)
					</Label>
					<Input
						id='discountValue'
						type='number'
						min='0.01'
						max='0.99'
						defaultValue='0.1'
						step={0.01}
						ref={valueRef}
						required
						placeholder='Podaj wartość (np. 0.1)'
					/>
				</section>

				<section className={classes['grid-row']}>
					<Label htmlFor='expirationDate'>
						Data wygaśnięcia
					</Label>
					<Input
						type='datetime-local'
						id='expirationDate'
						ref={expirationDateRef}
						required
					/>
				</section>

				<section className={classes['grid-row']}>
					<Label htmlFor='usageLimit'>
						Liczba limit do wykorzystania
					</Label>
					<Input
						type='number'
						defaultValue='500'
						id='usageLimit'
						ref={usageLimitRef}
						required
						placeholder='Podaj limit wykorzystania'
					/>
				</section>

				<section className={classes['grid-row']}>
					<Label htmlFor='minOrderValue'>
						Minimalna wartość zamówienia
					</Label>
					<Input
						type='number'
						defaultValue='300'
						id='minOrderValue'
						ref={minAmountOrderRef}
						required
						placeholder='Podaj minimalną wartość zamówienia'
					/>
				</section>
			</fieldset>

			<footer className={classes['submit-button-container']}>
				<Button>Dodaj</Button>
			</footer>
		</form>
	);
};

export default AddDiscountCode;
