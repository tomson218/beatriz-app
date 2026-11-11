import useResetPasswordMutation from '../../api/mutations/useResetPasswordMutation';

import { useForm, SubmitHandler } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { useParams } from 'react-router-dom';
import classes from './ResetPassword.module.css';
import { Toaster } from 'react-hot-toast';

const ResetPassword = () => {
	const { resetToken } = useParams();

	type Inputs = {
		password: string;
		passwordConfirm: string;
	};

	const { mutate: resetPassword } = useResetPasswordMutation(resetToken ?? '');

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = data => {
		resetPassword(data);
	};

	return (
		<div className={classes.container}>
			{' '}
			<form onSubmit={handleSubmit(onSubmit)} className={classes['login-form']}>
				{' '}
				<h2 className={classes['form-title']}>Zresetuj hasło</h2>{' '}
				<div className={classes['input-group']}>
					{' '}
					<label htmlFor='password'>Password: </label>{' '}
					<input
						id='password'
						placeholder='Password'
						type='password'
						className={classes['input']}
						{...register('password', { required: true, minLength: 8 })}
					/>{' '}
					{errors.password && <p className={classes['error-message']}>This field is required</p>}{' '}
				</div>{' '}
				<div className={classes['input-group']}>
					{' '}
					<label htmlFor='passwordConfirm'>Password confirm: </label>{' '}
					<input
						type='password'
						id='passwordConfirm'
						className={classes['input']}
						placeholder='Password confirm'
						{...register('passwordConfirm', {
							validate: value => value === watch('password') || 'Passwords do not match',
							required: true,
						})}
					/>{' '}
					{errors.passwordConfirm?.type === 'required' && (
						<p className={classes['error-message']}>Password confirm is required</p>
					)}{' '}
					{errors.passwordConfirm?.type === 'validate' && (
						<p className={classes['error-message']}>Passwords do not match</p>
					)}{' '}
				</div>{' '}
				<Button type='submit' className={classes['submit-button']}>
					{' '}
					Change{' '}
				</Button>{' '}
			</form>{' '}
			<Toaster position='bottom-right' reverseOrder={false} />
		</div>
	);
};

export default ResetPassword;
