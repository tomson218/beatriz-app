import { Link } from 'react-router-dom';
import StatusResult from '@/components/libs/StatusResult/StatusResult';
import { Button } from '@/components/ui/Button/Button';
import classes from './Success.module.css';

const Success = () => {
	return (
		<main className={classes.container}>
			<StatusResult
				status='success'
				title='Płatność została pomyślnie zakończona!'
				subTitle='Dziękujemy za zakup! Na Twój adres e-mail wysłaliśmy wiadomość z potwierdzeniem zamówienia.'
			/>
			<nav>
				<Link to='/home'>
					<Button variant='outline' className='mx-auto block'>
						Powróć do ekranu głównego
					</Button>
				</Link>
			</nav>
		</main>
	);
};

export default Success;
