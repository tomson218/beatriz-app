import { Button } from '@/components/ui/Button/Button';
import Form from '@/components/Form/Form';
import { useForm, SubmitHandler } from 'react-hook-form';
import useChangeUserPasswordMutation from '@/api/mutations/useChangeUserPasswordMutation';
import classes from './ChangeUserPassword.module.css';
import type { ChangePasswordInputs } from '@beatriz/shared/auth';

const ChangeUserPassword = () => {
	const { mutate: changePassword } = useChangeUserPasswordMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ChangePasswordInputs>();

	const onSubmit: SubmitHandler<ChangePasswordInputs> = data => {
		changePassword(data);
	};

	return (
		<>
			<h1 className={classes.heading}>Zmiana hasła</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<Form.PolishInput
					labelText='Obecne hasło'
					inputId='passwordCurrent'
					placeholder='Obecne hasło'
					type='password'
					register={register}
					{...register('passwordCurrent')}
					validation={{
						required: 'To pole jest wymagane',
						minLength: { value: 8, message: 'Hasło musi składać się z co najmniej 8 znaków' },
					}}
					className={classes['input-container']}
				/>
				<Form.PolishInput
					labelText='Nowe hasło'
					inputId='password'
					placeholder='Nowe hasło'
					type='password'
					register={register}
					{...register('password')}
					validation={{
						required: 'To pole jest wymagane',
						minLength: { value: 8, message: 'Hasło musi składać się z co najmniej 8 znaków' },
					}}
					className={classes['input-container']}
				/>
				<Form.PolishInput
					labelText='Potwierdzenie hasła'
					inputId='passwordConfirm'
					placeholder='Potwierdzenie hasła'
					type='password'
					register={register}
					{...register('passwordConfirm')}
					validation={{
						required: 'To pole jest wymagane',
						minLength: { value: 8, message: 'Hasło musi składać się z co najmniej 8 znaków' },
					}}
					className={classes['input-container']}
				/>
				<Button type='submit'>Zmień hasło</Button>
			</form>
		</>
	);
};
export default ChangeUserPassword;
