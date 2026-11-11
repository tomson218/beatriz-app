import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import useSignUpUserMutation from '../../api/mutations/useSignUpUserMutation';
import classes from './Register.module.css';
import { Button } from '@/components/ui/button';
import Divider from '@mui/material/Divider';
import Form from './../../components/Form/Form';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import useFacebookLoginMutation from '@/api/mutations/useFacebookLoginMutation';
import SocialMediaLogin from '../../components/SocialMediaLogin/SocialMediaLogin';

const Register = () => {
	type Inputs = {
		username: string;
		firstName: string;
		lastName: string;
		email: string;
		password: string;
		passwordConfirm: string;
		validate: () => void;
	};

	const { mutate: newUser } = useSignUpUserMutation();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = data => {
		newUser(data);
	};

	const { mutate: facebookLogin } = useFacebookLoginMutation();

	const [facebookData, setFacebookData] = useState({ tokens: null, userProfile: null });

	useEffect(() => {
		if (facebookData.tokens && facebookData.userProfile) {
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
							placeholder='Username'
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
							placeholder='First Name'
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
							placeholder='Last Name'
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

						<Form.Button content='Utwórz konto' variant='default' className={classes.btnLogin} />
					</Form>

					<Divider
						sx={{ width: '400px', textAlign: 'center', borderBottom: '1px solid #ccc', margin: '2rem 0' }}>
						<span className={classes.dividerSpan}>LUB</span>
					</Divider>
					<SocialMediaLogin />

					<div className={classes.noAccount}>
						<p>Masz już konto?</p>
						<Button className={classes['create-account']} variant='link' asChild>
							<Link to='/'>Zaloguj się</Link>
						</Button>
					</div>
				</section>
				<Toaster position='bottom-right' reverseOrder={false} />
			</main>
		</>
	);
};

export default Register;
