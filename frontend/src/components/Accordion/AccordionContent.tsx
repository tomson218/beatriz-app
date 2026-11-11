interface AccordionContentProps {
	content: string;
}

const AccordionContent = ({ content }: AccordionContentProps) => {
	return <p>{content}</p>;
};

export default AccordionContent;
