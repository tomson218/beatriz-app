import useForgetPasswordMutation from '../../api/mutations/useForgetPasswordMutation';
import { useForm, SubmitHandler } from 'react-hook-form';
import classes from './ForgetPassword.module.css';
import { Button } from '@/components/ui/button';
import { Toaster } from 'react-hot-toast';

const ForgetPassword = () => {
	type Inputs = {
		email: string;
	};

	const { mutate: forgetPassword } = useForgetPasswordMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = data => {
		forgetPassword(data);
	};

	return (
		<div className={classes.container}>
			<form onSubmit={handleSubmit(onSubmit)} className={classes['login-form']}>
				<h2 className={classes['form-title']}>Zapomnienie hasła</h2>
				<div className={classes['input-form']}>
					<label htmlFor='email'>Email: </label>
					<input
						type='email'
						id='email'
						placeholder='Wprowadź swój e-mail'
						className={classes['input']}
						{...register('email', {
							required: { value: true, message: 'To pole jest wymagane!' },
							minLength: { value: 8, message: 'Minimalna długość hasła jest równa 8!' },
						})}
					/>
					{errors.email && <p className={classes['error-message']}>{errors.email?.message}</p>}
				</div>
				<Button type='submit' className={classes['submit-button']}>
					Change
				</Button>
			</form>
			<Toaster position='bottom-right' reverseOrder={false} />
		</div>
	);
};

export default ForgetPassword;
