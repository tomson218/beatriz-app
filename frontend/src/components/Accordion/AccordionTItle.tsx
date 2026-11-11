interface AccordionTitleProps {
	className?: string;
	title: string;
}

const AccordionTitle = ({ className, title }: AccordionTitleProps) => {
	return <summary className={className}>{title}</summary>;
};

export default AccordionTitle;
