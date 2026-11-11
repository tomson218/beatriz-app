import { ReactNode } from 'react';
import classes from './Input.module.css';

interface InputProps {
	labelText: string;
	type: string;
	placeholder: string;
	htmlFor: string;
	children: ReactNode;
}

const Input = ({ htmlFor, labelText, type = 'text', placeholder, children, ...props }: InputProps) => {
	return (
		<div className={classes['input-box']}>
			<label htmlFor={htmlFor}>{labelText}</label>
			<input type={type} placeholder={placeholder} {...props} />
			{children}
		</div>
	);
};

export default Input;
