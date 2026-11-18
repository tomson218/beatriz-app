import { Input } from '@/shared/components/ui/Input/Input';
import { Label } from '@/shared/components/ui/Label/Label';
import classes from './FormInput.module.css';
import type {
	UseFormRegisterReturn,
	FieldValues,
	Path,
	RegisterOptions,
	FieldError,
} from 'react-hook-form';
import type { InputHTMLAttributes } from 'react';

interface FormInputProps<T extends FieldValues = FieldValues>
	extends Omit<InputHTMLAttributes<HTMLInputElement>, 'register' | 'validation'> {
	labelText: string;
	inputId: string;
	placeholder: string;
	type?: string;
	errorMessage?: string;
	error?: FieldError | undefined;
	register: (name: Path<T>, validation?: RegisterOptions<T>) => UseFormRegisterReturn;
	validation?: RegisterOptions<T>;
	className?: string;
}

const FormInput = <T extends FieldValues>({
	labelText,
	inputId,
	placeholder,
	type = 'text',
	errorMessage,
	error,
	register,
	validation,
	className,
	...props
}: FormInputProps<T>) => {
	const getMessage = () => {
		if (errorMessage) return errorMessage;
		if (error?.message) return error.message;
		return null;
	};

	const message = getMessage();

	return (
		<section className={className || classes['form-group']}>
			<Label htmlFor={inputId}>{labelText}</Label>
			<Input
				placeholder={placeholder}
				id={inputId}
				type={type}
				{...register(inputId as Path<T>, validation)}
				{...props}
			/>
			{message && <p className={classes['error-message']}>{message}</p>}
		</section>
	);
};

export default FormInput;
