import useGetUserByIdQuery from '@/features/users/api/queries/useGetUserByIdQuery';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useUpdateUserDetailsMutation from '@/features/users/api/mutations/useUpdateUserDetailsMutation';
import { getItemLocalStorage } from '@/shared/utils/localStorage';
import classes from './UpdateUserDetails.module.css';
import type { UpdateMeRequest } from '@beatriz/shared/users';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shared/components/ui/Dialog/Dialog';
import { Input } from '@/shared/components/ui/Input/Input';
import { Button } from '@/shared/components/ui/Button/Button';
import { FormField } from '@/shared/components/ui/FormField/FormField';
import Form from '@/shared/components/Form/Form';

const UpdateUserDetails = () => {
	const userId: string | null = getItemLocalStorage<string>('user-id');

	const { data: userDetails, isUserDetailsLoading } = useGetUserByIdQuery(userId ?? '');

	const { mutate: updatedUser } = useUpdateUserDetailsMutation();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<UpdateMeRequest>();

	useEffect(() => {
		if (userDetails) {
			reset({
				username: userDetails.username,
				firstName: userDetails.firstName,
				lastName: userDetails.lastName,
				email: userDetails.email,
			});
		}
	}, [userDetails, reset]);

	const onSubmit: SubmitHandler<UpdateMeRequest> = data => {
		updatedUser(data);
	};

	if (isUserDetailsLoading) {
		return <p>Ładowanie...</p>;
	}

	return (
		<>
 		<form onSubmit={handleSubmit(onSubmit)}>
			<Form.PolishInput
				labelText='Nazwa użytkownika'
				inputId='username'
				placeholder='Nazwa użytkownika'
				register={register}
				validation={{
					required: true,
					minLength: { value: 8 },
				}}
				className={classes['input-form']}
			/>

			<Form.PolishInput
				labelText='Imię'
				inputId='firstName'
				placeholder='Imię'
				register={register}
				validation={{
					required: true,
					minLength: { value: 8 },
				}}
				className={classes['input-form']}
			/>

			<Form.PolishInput
				labelText='Nazwisko'
				inputId='lastName'
				placeholder='Nazwisko'
				register={register}
				validation={{
					required: true,
					minLength: { value: 8 },
				}}
				className={classes['input-form']}
			/>
			<Form.PolishInput
				labelText='Email'
				inputId='email'
				placeholder='Adres e-mail'
				type='email'
				register={register}
				validation={{
					required: true,
					minLength: { value: 8 },
				}}
				className={classes['input-form']}
			/>

			<Button type='submit'>Zaktualizuj</Button>
		</form>
		<Link to='/'>
			<p>Mam już konto. Zaloguj się</p>
		</Link>

		<Dialog>
			<DialogTrigger asChild>
				<Button variant='outline'>Edytuj profil</Button>
			</DialogTrigger>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Edytuj profil</DialogTitle>
					<DialogDescription>
						Wprowadź zmiany w swoim profilu. Kliknij Zapisz, gdy skończysz.
					</DialogDescription>
				</DialogHeader>
			<div className={classes['dialog-body']}>
				<FormField label='Nazwa użytkownika' htmlFor='name'>
					<Input id='name' value={userDetails?.username} />
				</FormField>
				<FormField label='Imię' htmlFor='firstName'>
					<Input id='firstName' value={userDetails?.firstName} />
				</FormField>
				<FormField label='Nazwisko' htmlFor='lastName'>
					<Input id='lastName' value={userDetails?.lastName} />
				</FormField>
				<FormField label='Email' htmlFor='email'>
					<Input id='email' value={userDetails?.email} />
				</FormField>
			</div>

				<DialogFooter>
					<Button type='submit'>Zapisz zmiany</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	</>
	);
};

export default UpdateUserDetails;
