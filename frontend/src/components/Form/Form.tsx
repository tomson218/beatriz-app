import FormInput from './FormInput';
import FormButton from './FormButton';
import PolishFormInput from './PolishFormInput';
import type { FormHTMLAttributes, ReactNode } from 'react';

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
	children: ReactNode;
}

const Form = ({ children, ...props }: FormProps) => {
	return <form {...props}>{children}</form>;
};

Form.Input = FormInput;
Form.PolishInput = PolishFormInput;
Form.Button = FormButton;

export default Form;
