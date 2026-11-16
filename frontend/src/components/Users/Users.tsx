import useGetAllUsersQuery from '@/api/queries/useGetAllUsersQuery';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField } from '@/components/ui/formField';
import { hasNoUsers } from '@/utils/users';
import VisibilityIcon from '@/assets/icons/VisibilityIcon';
import { useRef } from 'react';
import DeleteIcon from '@/assets/icons/DeleteIcon';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';

import classes from './Users.module.css';
import EditIcon from '@/assets/icons/EditIcon';
import useEditUserMutation from '@/api/mutations/useEditUserMutation';
import useDeleteUserMutation from '@/api/mutations/useDeleteUserMutation';
import type { UserDto } from '@beatriz/shared/users';

interface ViewUserProps {
	user: UserDto;
}

interface EditUserHandler {
	(e: React.FormEvent, id: string): void;
}

interface DeleteUserHandler {
	(e: React.FormEvent, id: string): void;
}

const Users = () => {
	const { data: users, isLoading: isUsersLoading } = useGetAllUsersQuery();

	const { mutate: editUser } = useEditUserMutation();

	const { mutate: deleteUser } = useDeleteUserMutation();

	const editFirstName = useRef('');
	const editLastName = useRef('');
	const editEmail = useRef('');
	const editUsername = useRef('');

	if (isUsersLoading) {
		return <div>Loading</div>;
	}

	const VIewUser = ({ user }: ViewUserProps) => {
		return (
			<Dialog>
				<DialogTrigger asChild>
					<VisibilityIcon className={classes['view-icon']} />
				</DialogTrigger>
				<DialogContent className={`${classes['dialog-content']} sm:max-w-[500px]`}>
					<DialogHeader>
						<DialogTitle className={classes['dialog-title']}>Szczegóły konta</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditUser}>
						<div className='grid gap-4 py-4'>
							<FormField label='Username' htmlFor='name'>
								<Input id='name' defaultValue={user?.username} readOnly />
							</FormField>
							<FormField label='First Name' htmlFor='firstName'>
								<Input id='firstName' value={user?.firstName} readOnly />
							</FormField>
							<FormField label='Last Name' htmlFor='lastName'>
								<Input id='lastName' value={user?.lastName} readOnly />
							</FormField>
							<FormField label='Email' htmlFor='email'>
								<Input id='email' value={user?.email} readOnly />
							</FormField>
							<FormField label='Email' htmlFor='email2'>
								<Input id='email2' value={user?.email} readOnly />
							</FormField>
							<FormField label='Zalogowany przez Google' htmlFor='google'>
								<p>
									{Object.hasOwn(user, 'googleId') ? (
										<svg
											fill='#0f0'
											width='32px'
											height='32px'
											viewBox='0 0 1920 1920'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												d='M854.344 1317.685 503.209 966.55l79.85-79.85 271.285 271.285 520.207-520.32 79.849 79.962-600.056 600.057ZM960.056 0c-529.355 0-960 430.645-960 960s430.645 960 960 960c529.243 0 960-430.645 960-960S1489.3 0 960.056 0Z'
												fill-rule='evenodd'
											/>
										</svg>
									) : (
										'X'
									)}
								</p>
							</FormField>
							<FormField label='Zalogowany przez Facebooka' htmlFor='facebook'>
								<p>{Object.hasOwn(user, 'facebookData') ? 'TAK' : 'NIE'}</p>
							</FormField>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		);
	};

	const handleEditUser: EditUserHandler = async (e, id) => {
		e.preventDefault();

		const updatedUser = {
			username: editUsername.current?.value,
			firstName: editFirstName.current?.value,
			lastName: editLastName.current?.value,
			email: editEmail.current?.value,
		};

		await editUser({ id, updatedUser });
	};

	const handleDeleteUser: DeleteUserHandler = (e, id) => {
		e.preventDefault();

		deleteUser(id);
	};

	return (
		<>
			<main className={classes['users-page']}>
 			{hasNoUsers(users) && <p>Na razie nie ma żadnych użytkowników</p>}

 			{hasNoUsers(users) && <p>Brak danych!!</p>}

 			{!hasNoUsers(users) && (
					<table className={classes.table}>
						<thead className={classes.thead}>
							<tr>
								<th className={classes.th} scope='col'>
									E-mail
								</th>
								<th className={classes.th} scope='col'>
									Imię
								</th>
								<th className={classes.th} scope='col'>
									Nazwisko
								</th>
								<th className={classes.th} scope='col'>
									Username
								</th>
								<th className={classes.th} scope='col'>
									Akcje
								</th>
							</tr>
						</thead>
						<tbody className={classes.tbody}>
							{users.map(user => (
								<tr key={user._id}>
 								<td className={classes.td} scope='row'>
 									{user.email}
 								</td>
 								<td className={classes.td}>{user.firstName}</td>
								<td className={classes.td}>{user.lastName}</td>
								<td className={classes.td}>{user.username}</td>
								<td className={classes['td-actions']}>
									<VIewUser user={user} />
									<Dialog>
										<DialogTrigger asChild>
											<EditIcon className={classes['edit-icon']} />
										</DialogTrigger>
										<DialogContent className={`${classes['dialog-content']} sm:max-w-[500px]`}>
											<DialogHeader>
												<DialogTitle className={classes['dialog-title']}>
													Edit your profile
												</DialogTitle>
												<DialogDescription className={classes['dialog-description']}>
													Make changes to your profile here. Click save when you're done.
												</DialogDescription>
											</DialogHeader>
											<form onSubmit={e => handleEditUser(e, user._id)}>
												<div className='grid gap-4 py-4'>
													<FormField label='Username' htmlFor='name'>
														<Input
															id='name'
															defaultValue={user?.username}
															ref={editUsername}
															required
														/>
													</FormField>
													<FormField label='First Name' htmlFor='firstName'>
														<Input
															id='firstName'
															defaultValue={user?.firstName}
															ref={editFirstName}
															required
														/>
													</FormField>
													<FormField label='Last Name' htmlFor='lastName'>
														<Input
															id='lastName'
															defaultValue={user?.lastName}
															ref={editLastName}
															required
														/>
													</FormField>
													<FormField label='Email' htmlFor='email'>
														<Input
															id='email'
															defaultValue={user?.email}
															ref={editEmail}
															required
														/>
													</FormField>
												</div>

												<DialogFooter>
													<Button variant='secondary' type='submit'>
														Save changes
													</Button>
												</DialogFooter>
											</form>
										</DialogContent>
									</Dialog>

									<Dialog>
										<DialogTrigger asChild>
											<DeleteIcon
												className={classes['delete-icon']}
												onClick={() => console.log(user)}
											/>
										</DialogTrigger>
										<DialogContent className={`${classes['dialog-content']} sm:max-w-[500px]`}>
											<DialogHeader>
												<DialogTitle className={classes['dialog-title']}>
													Usuwanie konta użytkownika
												</DialogTitle>
											</DialogHeader>
											<form onSubmit={e => handleDeleteUser(e, user._id)}>
												<div className='grid gap-4 py-4'>
													Czy na pewno chcesz usunąć tego użytkownika?
												</div>

												<DialogFooter>
													<Button variant='destructive' type='submit'>
														Usuń
													</Button>
												</DialogFooter>
											</form>
										</DialogContent>
									</Dialog>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}
		</main>
	</>
);
};

export default Users;
