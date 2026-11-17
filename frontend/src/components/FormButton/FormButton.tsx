import { Button } from '@/components/ui/Button/Button';

interface FormButtonProps {
	content: string;
	onClick?: () => void;
}

const FormButton = ({ content, ...props }: FormButtonProps) => {
	return (
		<Button type='submit' {...props}>
			{content}
		</Button>
	);
};

export default FormButton;
