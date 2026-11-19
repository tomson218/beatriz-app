import { Button } from '@/shared/components/ui/Button/Button';

interface FormButtonProps {
	content: string;
	onClick?: () => void;
	className?: string;
}

const FormButton = ({ content, ...props }: FormButtonProps) => {
	return (
		<Button type='submit' {...props}>
			{content}
		</Button>
	);
};

export default FormButton;
