import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/components/ui/Accordion/Accordion';
import { FAQ_ITEMS } from '@beatriz/shared/constants/faq';
import classes from './Faq.module.css';

const Faq = () => {
	return (
		<section className={classes.page}>
			<header className={classes.header}>
				<p className={classes.eyebrow}>Pomoc</p>
				<h1 className={classes.title}>Sekcja FAQ</h1>
			</header>

			<Accordion
				type='single'
				collapsible
				className='w-full rounded-xl border border-slate-200 bg-white shadow-sm'>
				{FAQ_ITEMS.map(({ id, question, answer }) => (
					<AccordionItem
						key={id}
						value={`item-${id}`}
						className='border-b border-slate-200 px-4 last:border-b-0'>
						<AccordionTrigger className='text-left text-base font-semibold text-slate-900 hover:no-underline'>
							{question}
						</AccordionTrigger>
						<AccordionContent className='pb-4 pt-0 text-sm leading-6 text-slate-600'>
							{answer}
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</section>
	);
};

export default Faq;
