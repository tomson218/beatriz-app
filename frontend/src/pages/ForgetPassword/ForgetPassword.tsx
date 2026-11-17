import useForgetPasswordMutation from '@/api/mutations/useForgetPasswordMutation';
import { useForm, SubmitHandler } from 'react-hook-form';
import classes from './ForgetPassword.module.css';
import { Button } from '@/components/ui/Button/Button';
import Form from '@/components/Form/Form';
import { Toaster } from 'react-hot-toast';
import type { ForgetPasswordRequest } from '@beatriz/shared/auth';

const ForgetPassword = () => {
	const { mutate: forgetPassword } = useForgetPasswordMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgetPasswordRequest>();

	const onSubmit: SubmitHandler<ForgetPasswordRequest> = data => {
		forgetPassword(data);
	};

	return (
		<main className={classes.container}>
			<form onSubmit={handleSubmit(onSubmit)} className={classes['login-form']}>
				<h2 className={classes['form-title']}>Zapomnienie hasła</h2>
				<Form.Input
					labelText='E-mail'
					inputId='email'
					placeholder='Wprowadź swój e-mail'
					type='email'
					register={register}
					error={errors.email}
					validation={{
						required: { value: true, message: 'To pole jest wymagane!' },
						minLength: { value: 8, message: 'Minimalna długość hasła jest równa 8!' },
					}}
					className={classes['input-form']}
				/>
				<Button type='submit'>
					Wyślij
				</Button>
			</form>
			<Toaster position='bottom-right' reverseOrder={false} />
		</main>
	);
};

export default ForgetPassword;
