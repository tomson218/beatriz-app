import useGetAllUsersQuery from '../../api/queries/useGetAllUsersQuery';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import VisibilityIcon from '@/assets/icons/VisibilityIcon';
import { useRef } from 'react';
import DeleteIcon from '../../assets/icons/DeleteIcon';

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
import EditIcon from '../../assets/icons/EditIcon';
import useEditUserMutation from '@/api/mutations/useEditUserMutation';
import useDeleteUserMutation from '@/api/mutations/useDeleteUserMutation';

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

	const VIewUser = ({ user }) => {
		return (
			<Dialog>
				<DialogTrigger asChild>
					<VisibilityIcon style={{ cursor: 'pointer' }} className={classes['view-icon']} />
				</DialogTrigger>
				<DialogContent
					className='sm:max-w-[500px]'
					style={{
						backgroundColor: 'black',
						color: 'white',
						border: '1px solid orange',
						borderRadius: '16px',
					}}>
					<DialogHeader>
						<DialogTitle style={{ fontSize: '1.5rem' }}>Szczegóły konta</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleEditUser}>
						<div className='grid gap-4 py-4'>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='name' className='text-right'>
									Username
								</Label>
								<Input id='name' defaultValue={user?.username} className='col-span-3' readOnly />
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='firstName' className='text-right'>
									First Name
								</Label>
								<Input id='firstName' value={user?.firstName} className='col-span-3' readOnly />
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='lastName' className='text-right'>
									Last Name
								</Label>
								<Input id='lastName' value={user?.lastName} className='col-span-3' readOnly />
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='name' className='text-right'>
									Email
								</Label>
								<Input id='name' value={user?.email} className='col-span-3' readOnly />
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='name' className='text-right'>
									Email
								</Label>
								<Input id='name' value={user?.email} className='col-span-3' readOnly />
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='name' className='text-right'>
									Zalogowany przez Google
								</Label>
								<p className='col-span-3'>
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
							</div>
							<div className='grid grid-cols-4 items-center gap-4'>
								<Label htmlFor='name' className='text-right'>
									Zalogowany przez Facebooka
								</Label>
								<p className='col-span-3'>{Object.hasOwn(user, 'facebookData') ? 'TAK' : 'NIE'}</p>
							</div>
						</div>
					</form>
				</DialogContent>
			</Dialog>
		);
	};

	const handleEditUser = async (e, id) => {
		e.preventDefault();

		const updatedUser = {
			username: editUsername.current?.value,
			firstName: editFirstName.current?.value,
			lastName: editLastName.current?.value,
			email: editEmail.current?.value,
		};

		await editUser({ id, updatedUser });
	};

	const handleDeleteUser = (e, id) => {
		e.preventDefault();

		deleteUser(id);
	};

	return (
		<>
			<div style={{ backgroundColor: 'white', minHeight: '90.4dvh', paddingTop: '4rem' }}>
				{users.length === 0 && <p>Na razie nie ma żadnych użytkowników</p>}

				{users.length === 0 && <p>Brak danych!!</p>}

				{users.length !== 0 && (
					<table className={classes.table}>
						<thead className={classes.thead}>
							<tr style={{ borderCollapse: 'collapse' }}>
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
									<td
										className={classes.td}
										style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
										<VIewUser user={user} />
										<Dialog>
											<DialogTrigger asChild>
												<EditIcon className={classes['edit-icon']} />
											</DialogTrigger>
											<DialogContent
												className='sm:max-w-[500px]'
												style={{
													backgroundColor: 'black',
													color: 'white',
													border: '1px solid orange',
													borderRadius: '16px',
												}}>
												<DialogHeader>
													<DialogTitle style={{ fontSize: '1.5rem' }}>
														Edit your profile
													</DialogTitle>
													<DialogDescription style={{ paddingTop: '10px' }}>
														Make changes to your profile here. Click save when you're done.
													</DialogDescription>
												</DialogHeader>
												<form onSubmit={e => handleEditUser(e, user._id)}>
													<div className='grid gap-4 py-4'>
														<div className='grid grid-cols-4 items-center gap-4'>
															<Label htmlFor='name' className='text-right'>
																Username
															</Label>
															<Input
																id='name'
																defaultValue={user?.username}
																ref={editUsername}
																className='col-span-3'
																required
															/>
														</div>
														<div className='grid grid-cols-4 items-center gap-4'>
															<Label htmlFor='firstName' className='text-right'>
																First Name
															</Label>
															<Input
																id='firstName'
																defaultValue={user?.firstName}
																ref={editFirstName}
																className='col-span-3'
																required
															/>
														</div>
														<div className='grid grid-cols-4 items-center gap-4'>
															<Label htmlFor='lastName' className='text-right'>
																Last Name
															</Label>
															<Input
																id='lastName'
																defaultValue={user?.lastName}
																className='col-span-3'
																ref={editLastName}
																required
															/>
														</div>
														<div className='grid grid-cols-4 items-center gap-4'>
															<Label htmlFor='name' className='text-right'>
																Email
															</Label>
															<Input
																id='name'
																defaultValue={user?.email}
																className='col-span-3'
																ref={editEmail}
																required
															/>
														</div>
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
											<DialogContent
												className='sm:max-w-[500px]'
												style={{
													backgroundColor: 'black',
													color: 'white',
													border: '1px solid orange',
													borderRadius: '16px',
												}}>
												<DialogHeader>
													<DialogTitle style={{ fontSize: '1.5rem' }}>
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
			</div>
		</>
	);
};

export default Users;
