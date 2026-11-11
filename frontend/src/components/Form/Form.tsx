import FormInput from './FormInput';
import FormButton from './FormButton';

interface FormProps {
	children: React.ReactNode;
	[key: string]: any;
}

const Form = ({ children, ...props }: FormProps) => {
	return <form {...props}>{children}</form>;
};

Form.Input = FormInput;
Form.Button = FormButton;

export default Form;
