import FormInput from '@/shared/components/FormInput/FormInput';
import FormButton from '@/shared/components/FormButton/FormButton';
import PolishFormInput from '@/shared/components/PolishFormInput/PolishFormInput';
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
