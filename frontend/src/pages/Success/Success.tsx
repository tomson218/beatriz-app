import { Link } from 'react-router-dom';
import StatusResult from '../../components/libs/StatusResult';
import { Button } from '@/components/ui/button';
import classes from './Success.module.css';

const Success = () => {
	return (
		<div className={classes.container}>
			<StatusResult
				status='success'
				title='Płatność została pomyślnie zakończona!'
				subTitle='Dziękujemy za zakup! Na Twój adres e-mail wysłaliśmy wiadomość z potwierdzeniem zamówienia.'
			/>
			<Link to='/home'>
				<Button variant='outline' className='mx-auto block'>
					Powróć do ekranu głównego
				</Button>
			</Link>
		</div>
	);
};

export default Success;
