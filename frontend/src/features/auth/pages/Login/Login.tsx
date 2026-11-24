import { useForm, SubmitHandler } from 'react-hook-form';
import useLoginUserMutation from '@/features/auth/api/mutations/useLoginUserMutation';
import { Link } from 'react-router-dom';
import classes from './Login.module.css';
import { Button } from '@/shared/components/ui/Button/Button';
import Divider from '@mui/material/Divider';
import Form from '@/shared/components/Form/Form';
import { Toaster } from 'react-hot-toast';
import SocialMediaLogin from '@/features/auth/components/SocialMediaLogin/SocialMediaLogin';
import type { LoginRequest } from '@beatriz/shared/auth';

const Login = () => {
	const { mutate: loginUser } = useLoginUserMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginRequest>();

	const onSubmit: SubmitHandler<LoginRequest> = data => {
		loginUser(data);
	};

	return (
		<main className={classes.container}>
			<aside className={classes.image}></aside>
			<section className={classes.forms}>
				<h1 className={classes.title}>Zaloguj się</h1>
				<Form onSubmit={handleSubmit(onSubmit)} className={classes['login-form']}>
					<Form.Input
						labelText='Email'
						inputId='email'
						type='email'
						placeholder='E-mail'
						register={register}
						errorMessage={errors.email && errors.email.message}
						validation={{
							required: 'Email is required',
							minLength: {
								value: 8,
								message: 'Email must be at least 8 characters',
							},
						}}
					/>
					<Form.Input
						labelText='Hasło'
						inputId='password'
						type='password'
						placeholder='Hasło'
						register={register}
						errorMessage={errors.password && errors.password.message}
						validation={{
							required: 'Hasło jest wymagane',
							minLength: {
								value: 8,
								message: 'Hasło musi składać się z co najmniej 8 znaków',
							},
						}}
					/>
					<Form.Button content='Zaloguj się' className='w-full mt-6' />
				</Form>
				<Divider sx={{ width: '400px', textAlign: 'center', borderBottom: '1px solid #ccc', margin: '2rem 0' }}>
					<span className={classes['divider-span']}>LUB</span>
				</Divider>

				<SocialMediaLogin />

				<footer className={classes['no-account']}>
					<p>Nie masz jeszcze konta?</p>

					<Button variant='link' asChild>
						<Link to='/register'>Utwórz swoje konto</Link>
					</Button>
				</footer>
			</section>
			<Toaster position='bottom-right' reverseOrder={false} />
		</main>
	);
};

export default Login;
