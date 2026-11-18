import useGetAllUsersQuery from '@/api/queries/useGetAllUsersQuery';
import { Input } from '@/components/ui/Input/Input';
import { Button } from '@/components/ui/Button/Button';
import { FormField } from '@/components/ui/FormField/FormField';
import { hasAnyUsers, hasNoUsers } from '@/utils/users';
import DeleteIcon from '@/assets/icons/DeleteIcon';
import { useRef } from 'react';
import ViewUser from '../ViewUser/ViewUser';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog/Dialog';

import classes from './Users.module.css';
import EditIcon from '@/assets/icons/EditIcon';
import useEditUserMutation from '@/api/mutations/useEditUserMutation';
import useDeleteUserMutation from '@/api/mutations/useDeleteUserMutation';

type UserHandler = (e: React.FormEvent, id: string) => void;

const Users = () => {
	const { data: users, isLoading: isUsersLoading } = useGetAllUsersQuery();

	const { mutate: editUser } = useEditUserMutation();

	const { mutate: deleteUser } = useDeleteUserMutation();

	const editFirstName = useRef<HTMLInputElement>(null);
	const editLastName = useRef<HTMLInputElement>(null);
	const editEmail = useRef<HTMLInputElement>(null);
	const editUsername = useRef<HTMLInputElement>(null);

	if (isUsersLoading) {
		return <p>Ładowanie...</p>;
	}

	const handleEditUser: UserHandler = async (e, id) => {
		e.preventDefault();

		const updatedUser = {
			username: editUsername.current?.value,
			firstName: editFirstName.current?.value,
			lastName: editLastName.current?.value,
			email: editEmail.current?.value,
		};

		await editUser({ id, updatedUser });
	};

	const handleDeleteUser: UserHandler = (e, id) => {
		e.preventDefault();

		deleteUser(id);
	};

	return (
		<>
			<main className={classes['users-page']}>
				{hasNoUsers(users) && <p>Na razie nie ma żadnych użytkowników</p>}

				{hasAnyUsers(users) && (
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
										<ViewUser user={user} />
										<Dialog>
											<DialogTrigger asChild>
												<EditIcon className={classes['edit-icon']} />
											</DialogTrigger>
											<DialogContent className='sm:max-w-[500px]'>
												<DialogHeader>
													<DialogTitle>
														Edytuj profil
													</DialogTitle>
													<DialogDescription>
														Wprowadź zmiany w swoim profilu. Kliknij Zapisz, gdy skończysz.
													</DialogDescription>
												</DialogHeader>
												<form onSubmit={e => handleEditUser(e, user._id)}>
													<div className={classes['dialog-body']}>
														<FormField label='Nazwa użytkownika' htmlFor='name'>
															<Input
																id='name'
																defaultValue={user?.username}
																ref={editUsername}
																required
															/>
														</FormField>
														<FormField label='Imię' htmlFor='firstName'>
															<Input
																id='firstName'
																defaultValue={user?.firstName}
																ref={editFirstName}
																required
															/>
														</FormField>
														<FormField label='Nazwisko' htmlFor='lastName'>
															<Input
																id='lastName'
																defaultValue={user?.lastName}
																ref={editLastName}
																required
															/>
														</FormField>
														<FormField label='E-mail' htmlFor='email'>
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
															Zapisz zmiany
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
											<DialogContent className='sm:max-w-[500px]'>
												<DialogHeader>
													<DialogTitle>
														Usuwanie konta użytkownika
													</DialogTitle>
												</DialogHeader>
												<form onSubmit={e => handleDeleteUser(e, user._id)}>
													<p className={classes['dialog-body']}>
														Czy na pewno chcesz usunąć tego użytkownika?
													</p>

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
