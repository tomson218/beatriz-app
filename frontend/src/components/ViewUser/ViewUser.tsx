import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/Dialog/Dialog';
import { Input } from '@/components/ui/Input/Input';
import { FormField } from '@/components/ui/FormField/FormField';
import VisibilityIcon from '@/assets/icons/VisibilityIcon';
import type { UserDto } from '@beatriz/shared/users';

import classes from './ViewUser.module.css';

interface ViewUserProps {
	user: UserDto;
}

const ViewUser = ({ user }: ViewUserProps) => {
	const isGoogleAccount = Object.hasOwn(user, 'googleId');
	const isFacebookAccount = Object.hasOwn(user, 'facebookData');

	return (
		<Dialog>
			<DialogTrigger asChild>
				<VisibilityIcon className={classes['view-icon']} />
			</DialogTrigger>
			<DialogContent className='sm:max-w-[500px]'>
				<DialogHeader>
					<DialogTitle>Szczegóły konta</DialogTitle>
				</DialogHeader>
				<form>
					<div className={classes['dialog-body']}>
						<FormField label='Nazwa użytkownika' htmlFor='name'>
							<Input id='name' defaultValue={user?.username} readOnly />
						</FormField>
						<FormField label='Imię' htmlFor='firstName'>
							<Input id='firstName' value={user?.firstName} readOnly />
						</FormField>
						<FormField label='Nazwisko' htmlFor='lastName'>
							<Input id='lastName' value={user?.lastName} readOnly />
						</FormField>
						<FormField label='E-mail' htmlFor='email'>
							<Input id='email' value={user?.email} readOnly />
						</FormField>
						<FormField label='Zalogowany przez Google' htmlFor='google'>
							<p>
								{isGoogleAccount ? (
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
							<p>{isFacebookAccount ? 'TAK' : 'NIE'}</p>
						</FormField>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default ViewUser;
