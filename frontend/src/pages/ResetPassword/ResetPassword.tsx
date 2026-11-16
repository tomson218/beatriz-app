import useResetPasswordMutation from '@/api/mutations/useResetPasswordMutation';

import { useForm, SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import Form from '@/components/Form/Form';
import { useParams } from 'react-router-dom';
import classes from './ResetPassword.module.css';
import { Toaster } from 'react-hot-toast';
import type { ResetPasswordInputs } from '@beatriz/shared/auth';

const ResetPassword = () => {
	const { resetToken } = useParams();

	const { mutate: resetPassword } = useResetPasswordMutation(resetToken ?? '');

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<ResetPasswordInputs>();

	const onSubmit: SubmitHandler<ResetPasswordInputs> = data => {
		resetPassword(data);
	};

	return (
		<main className={classes.container}>
			<form onSubmit={handleSubmit(onSubmit)} className={classes['login-form']}>
				<h2 className={classes['form-title']}>Zresetuj hasło</h2>
				<Form.Input
					labelText='Hasło'
					inputId='password'
					placeholder='Hasło'
					type='password'
					register={register}
					error={errors.password}
					validation={{ required: true, minLength: 8 }}
					className={classes['input-group']}
				/>
				<Form.Input
					labelText='Potwierdzenie hasła'
					inputId='passwordConfirm'
					placeholder='Potwierdzenie hasła'
					type='password'
					register={register}
					error={errors.passwordConfirm}
					validation={{
						validate: value => value === watch('password') || 'Hasła nie są identyczne',
						required: true,
					}}
					className={classes['input-group']}
				/>
				<Button type='submit' className={classes['submit-button']}>
					Change
				</Button>
			</form>
			<Toaster position='bottom-right' reverseOrder={false} />
		</main>
	);
};

export default ResetPassword;
