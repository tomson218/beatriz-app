import { useForm, SubmitHandler } from 'react-hook-form';
import useLoginUserMutation from '../../api/mutations/useLoginUserMutation';
import { Link } from 'react-router-dom';
import classes from './Login.module.css';
import { Button } from '@/components/ui/button';
import Divider from '@mui/material/Divider';
import Form from './../../components/Form/Form';
import { Toaster } from 'react-hot-toast';
import SocialMediaLogin from '../../components/SocialMediaLogin/SocialMediaLogin';

const Login = () => {
	type Inputs = {
		email: string;
		password: string;
	};

	const { mutate: loginUser } = useLoginUserMutation();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<Inputs>();

	const onSubmit: SubmitHandler<Inputs> = data => {
		loginUser(data);
	};

	return (
		<main className={classes.container}>
			<aside className={classes.image}></aside>
			<section className={classes.forms}>
				<h1 className={classes.title}>Zaloguj się</h1>
				<Form onSubmit={handleSubmit(onSubmit)} className={classes.loginForm}>
					<Form.Input
						labelText='Email'
						inputId='email'
						type='email'
						placeholder='E-mail'
						register={register}
						errorMessage={errors.email && errors.email.message}
						{...register('email')}
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
						{...register('password')}
						validation={{
							required: 'Hasło jest wymagane',
							minLength: {
								value: 8,
								message: 'Hasło musi składać się z co najmniej 8 znaków',
							},
						}}
					/>
					<Form.Button content='Zaloguj się' variant='default' className={classes.btnLogin} />
				</Form>
				<Button variant='link' className={classes.forgetPassword}>
					<Link to='/forget-password'>Nie pamiętasz hasła?</Link>
				</Button>
				<Divider sx={{ width: '400px', textAlign: 'center', borderBottom: '1px solid #ccc', margin: '2rem 0' }}>
					<span className={classes.dividerSpan}>LUB</span>
				</Divider>

				<SocialMediaLogin />

				<div className={classes.noAccount}>
					<p>Nie masz jeszcze konta?</p>

					<Button className={classes['create-account']} variant='link' asChild>
						<Link to='/register'>Utwórz swoje konto</Link>
					</Button>
				</div>
			</section>
			<Toaster position='bottom-right' reverseOrder={false} />
		</main>
	);
};

export default Login;
