import Accordion from '../../components/Accordion/Accordion';
import classes from './Faq.module.css';

const DUMMY_FAQ = [
	{
		id: 1,
		question: 'Na jakie rodzaje wydarzeń można kupić bilety w tej aplikacji?',
		answer: 'W naszej aplikacji możesz zakupić bilety na różnorodne rodzaje wydarzeń, takie jak koncerty, festiwale, konferencje, targi branżowe, warsztaty i spektakle teatralne. Dzięki temu na pewno znajdziesz coś dla siebie ciekawego',
	},
	{
		id: 2,
		question: 'Jakie rodzaje biletów są dostępne?',
		answer: 'Beatriz App oferuje różne rodzaje biletów dostosowane do potrzeb klientów. Wśród biletów znajdują się bilety normalne, dla dzieci, VIP.',
	},
	{
		id: 3,
		question: 'Gdzie mogę sprawdzić swoje kupione bilety?',
		answer: 'Kupione bilety na wydarzenia można sprawdzić w zakładce "Bilety", w której masz dostęp do biletów nadchodzących wydarzeń, jak i dla tych, które już się odbyły.',
	},
	{
		id: 4,
		question: 'Czy wszystkie bilety są przypisane do konkretnych miejsc?',
		answer: 'Nie, to zależy od konkretnego wydarzenia, czy bilety będą przypisane do konkretnych miejsc, czy nie.',
	},
	{
		id: 5,
		question: 'Jak sprawdzić, czy mój bilet jest przypisany do konkretnego miejsca?',
		answer: 'Należy przejść do sekcji "Bilety". Na zakupionych biletach obok informacji o nazwie sektora i strefy powinien widnieć numer od 1 do 100. Jeśli jest on widoczny, to znaczy, że Twój bilet jest przypisany do konkretnego miejsca.',
	},
];

const Faq = () => {
	return (
		<div className={classes.container}>
			<h1 className={classes.heading}>Sekcja FAQ</h1>

			{DUMMY_FAQ.map(({ id, question, answer }) => (
				<Accordion key={id} className={classes.accordion}>
					<Accordion.Title className={classes['accordion-summary']} title={question} />
					<Accordion.Content content={answer} />
				</Accordion>
			))}
		</div>
	);
};

export default Faq;
