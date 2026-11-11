import AccordionContent from './AccordionContent';
import AccordionTitle from './AccordionTItle';

interface AccordionProps {
	children: React.ReactNode;
	className?: string;
}

const Accordion = ({ children, className, ...props }: AccordionProps) => {
	return (
		<details className={className} {...props}>
			{children}
		</details>
	);
};

export default Accordion;

Accordion.Title = AccordionTitle;
Accordion.Content = AccordionContent;
