import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import useSignUpUserMutation from '@/features/auth/api/mutations/useSignUpUserMutation';
import classes from './Register.module.css';
import { Button } from '@/shared/components/ui/Button/Button';
import Divider from '@mui/material/Divider';
import Form from '@/shared/components/Form/Form';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import useFacebookLoginMutation from '@/features/auth/api/mutations/useFacebookLoginMutation';
import SocialMediaLogin from '@/features/auth/components/SocialMediaLogin/SocialMediaLogin';
import type { SignUpInputs, FacebookLoginData } from '@beatriz/shared/auth';
import { isFacebookDataReady } from '@/features/auth/utils/auth';

const Register = () => {
	const { mutate: newUser } = useSignUpUserMutation();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<SignUpInputs>();

	const onSubmit: SubmitHandler<SignUpInputs> = data => {
		newUser(data);
	};

	const { mutate: facebookLogin } = useFacebookLoginMutation();

	const [facebookData, setFacebookData] = useState<FacebookLoginData>({ tokens: null, userProfile: null });

	useEffect(() => {
		if (isFacebookDataReady(facebookData)) {
			facebookLogin(facebookData);
		}
	}, [facebookData]);

	return (
		<>
			<main className={classes.container}>
				<aside className={classes.image}></aside>
				<section className={classes.forms}>
					<h1 className={classes.title}>Zarejestruj się</h1>
					<Form onSubmit={handleSubmit(onSubmit)} className={classes.loginForm}>
						<Form.Input
							labelText='Nazwa użytkownika'
							inputId='username'
 						placeholder='Nazwa użytkownika'
							register={register}
							errorMessage={errors.username && errors.username.message}
							{...register('username')}
							validation={{
								required: 'Nazwa użytkownika jest wymagana',
								minLength: {
									value: 8,
									message: 'Nazwa użytkownika musi składać się z co najmniej 8 znaków',
								},
							}}
						/>

						<Form.Input
							labelText='Imię'
							inputId='firstName'
 						placeholder='Imię'
							register={register}
							errorMessage={errors.firstName && errors.firstName.message}
							{...register('firstName')}
							validation={{
								required: 'Imię jest wymagane',
								minLength: {
									value: 8,
									message: 'Imię musi składać się z co najmniej 8 znaków',
								},
							}}
						/>

						<Form.Input
							labelText='Nazwisko'
							inputId='lastName'
 						placeholder='Nazwisko'
							register={register}
							errorMessage={errors.lastName && errors.lastName.message}
							{...register('lastName')}
							validation={{
								required: 'Nazwisko jest wymagane',
								minLength: {
									value: 8,
									message: 'Nazwisko musi składać się z co najmniej 8 znaków',
								},
							}}
						/>

						<Form.Input
							labelText='Email'
							inputId='email'
							type='email'
							placeholder='E-mail'
							register={register}
							errorMessage={errors.email && errors.email.message}
							{...register('email')}
							validation={{
								required: 'Adres e-mail jest wymaggany',
								minLength: {
									value: 8,
									message: 'Adres e-mail musi zawierać co najmniej 8 znaków',
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
							{...register('password')}
							validation={{
								required: 'Hasło jest wymagane',
								minLength: {
									value: 8,
									message: 'Hasło musi składać się z co najmniej 8 znaków',
								},
							}}
						/>

						<Form.Input
							labelText='Potwiedzenie hasła'
							inputId='passwordConfirm'
							type='password'
							placeholder='Potwiedzenie hasła'
							register={register}
							errorMessage={errors.passwordConfirm && errors.passwordConfirm.message}
							validation={{
								required: 'Potwierdzenie hasła jest wymagane',
								validate: value => value === watch('password') || 'Hasła nie są takie same',
							}}
							{...register('passwordConfirm')}
						/>

 					<Form.Button content='Utwórz konto' />
 				</Form>

 				<Divider
 					sx={{ width: '400px', textAlign: 'center', borderBottom: '1px solid #ccc', margin: '2rem 0' }}>
 					<span className={classes['divider-span']}>LUB</span>
 				</Divider>
 				<SocialMediaLogin />

 				<footer className={classes['no-account']}>
 					<p>Masz już konto?</p>
 					<Button variant='link' asChild>
 						<Link to='/'>Zaloguj się</Link>
 					</Button>
 				</footer>
				</section>
				<Toaster position='bottom-right' reverseOrder={false} />
			</main>
		</>
	);
};

export default Register;
