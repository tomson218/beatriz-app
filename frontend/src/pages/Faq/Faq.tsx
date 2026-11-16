import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/UI/accordion';
import { FAQ_ITEMS } from '@/constants/constants';

const Faq = () => {
	return (
		<section className='mx-auto max-w-4xl space-y-6 px-4 py-10'>
			<header className='space-y-2'>
				<p className='text-sm font-medium uppercase tracking-[0.2em] text-amber-600'>Pomoc</p>
				<h1 className='text-3xl font-bold text-slate-900'>Sekcja FAQ</h1>
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
