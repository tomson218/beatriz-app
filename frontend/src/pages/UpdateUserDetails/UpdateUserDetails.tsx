import useGetUserByIdQuery from '../../api/queries/useGetUserByIdQuery';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import useUpdateUserDetailsMutation from '../../api/mutations/useUpdateUserDetailsMutation';
import classes from './UpdateUserDetails.module.css';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const UpdateUserDetails = () => {
	const userId: string | null = localStorage.getItem('userId');

	const { data: userDetails, isUserDetailsLoading } = useGetUserByIdQuery(userId ?? '');

	type Inputs = {
		username: string;
		firstName: string;
		lastName: string;
		email: string;
	};

	const { mutate: updatedUser } = useUpdateUserDetailsMutation();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<Inputs>();

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

	const onSubmit: SubmitHandler<Inputs> = data => {
		updatedUser(data);
	};

	if (isUserDetailsLoading) {
		<div>Loading...</div>;
	}

	return (
		<>
			<form onSubmit={handleSubmit(onSubmit)}>
				<div className={classes['input-form']}>
					<label htmlFor='username'>Username: </label>
					<input
						id='username'
						placeholder='Username'
						{...register('username', { required: true, minLength: 8 })}
					/>
					{errors.username && <p className={classes['error-message']}>This field is required</p>}
				</div>

				<div className={classes['input-form']}>
					<label htmlFor='firstName'>First Name: </label>
					<input
						id='firstName'
						placeholder='First name'
						{...register('firstName', { required: true, minLength: 8 })}
					/>
					{errors.firstName && <p className={classes['error-message']}>This field is required</p>}
				</div>

				<div className={classes['input-form']}>
					<label htmlFor='lastName'>Last Name: </label>
					<input
						id='lastName'
						placeholder='Last name'
						{...register('lastName', { required: true, minLength: 8 })}
					/>
					{errors.lastName && <p className={classes['error-message']}>This field is required</p>}
				</div>
				<div className={classes['input-form']}>
					<label htmlFor='email'>Email: </label>
					<input
						type='email'
						id='email'
						placeholder='Email'
						{...register('email', { required: true, minLength: 8 })}
					/>
					{errors.email && <p className={classes['error-message']}>This field is required</p>}
				</div>

				<Button type='submit'>Update</Button>
			</form>
			<Link to='/'>
				<p>I already have an account. Sign in</p>
			</Link>

			<Dialog>
				<DialogTrigger asChild>
					<Button variant='outline'>Edit Profile</Button>
				</DialogTrigger>
				<DialogContent className='sm:max-w-[425px]'>
					<DialogHeader>
						<DialogTitle>Edit profile</DialogTitle>
						<DialogDescription>
							Make changes to your profile here. Click save when you're done.
						</DialogDescription>
					</DialogHeader>
					<div className='grid gap-4 py-4'>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='name' className='text-right'>
								Username
							</Label>
							<Input id='name' value={userDetails?.username} className='col-span-3' />
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='firstName' className='text-right'>
								First Name
							</Label>
							<Input id='firstName' value={userDetails?.firstName} className='col-span-3' />
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='lastName' className='text-right'>
								Last Name
							</Label>
							<Input id='lastName' value={userDetails?.lastName} className='col-span-3' />
						</div>
						<div className='grid grid-cols-4 items-center gap-4'>
							<Label htmlFor='name' className='text-right'>
								Email
							</Label>
							<Input id='name' value={userDetails?.email} className='col-span-3' />
						</div>
					</div>

					<DialogFooter>
						<Button type='submit'>Save changes</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};

export default UpdateUserDetails;
