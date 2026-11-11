import Button from '../../components/UI/Button/Button';
import { useForm, SubmitHandler } from 'react-hook-form';
import useChangeUserPasswordMutation from '../../api/mutations/useChangeUserPasswordMutation';
import classes from './ChangeUserPassword.module.css';

const ChangeUserPassword = () => {
	type Inputs = {
		passwordCurrent: string;
		password: string;
		passwordConfirm: string;
	};

	const { mutate: changePassword } = useChangeUserPasswordMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = data => {
		changePassword(data);
	};

	return (
		<>
			<h1 className={classes.heading}>Zmiana hasła</h1>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={classes['input-container']}>
					<label htmlFor='passwordCurrent'>Password Current: </label>
					<input
						className={classes.input}
						type='password'
						id='passwordCurrent'
						placeholder='Password Current'
						{...register('passwordCurrent', {
							required: { value: true, message: 'This field is required' },
							minLength: { value: 8, message: 'Minimal length is 8' },
						})}
					/>
					{errors.passwordCurrent && (
						<p className={classes['error-message']}>{errors.passwordCurrent?.message}</p>
					)}
				</div>
				<div className={classes['input-container']}>
					<label htmlFor='password'>Password: </label>
					<input
						className={classes.input}
						id='password'
						placeholder='Password'
						type='password'
						{...register('password', {
							required: { value: true, message: 'This field is required' },
							minLength: { value: 8, message: 'Minimal length is 8' },
						})}
					/>
					{errors.password && <p className={classes['error-message']}>{errors.password?.message}</p>}
				</div>

				<div className={classes['input-container']}>
					<label htmlFor='passwordConfirm'>Password Confirm: </label>
					<input
						className={classes.input}
						id='passwordConfirm'
						placeholder='Password Confirm'
						type='password'
						{...register('passwordConfirm', {
							required: { value: true, message: 'This field is required' },
							minLength: { value: 8, message: 'Minimal length is 8' },
						})}
					/>
					{errors.passwordConfirm && (
						<p className={classes['error-message']}>{errors.passwordConfirm?.message}</p>
					)}
				</div>

				<Button type='submit'>Change password</Button>
			</form>
		</>
	);
};
export default ChangeUserPassword;
