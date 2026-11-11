import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import classes from './FormInput.module.css';

interface FormInputProps {
	labelText: string;
	inputId: string;
	placeholder: string;
	type?: string;
	errorMessage?: string;
	register: any;
	validation: any;
}

const FormInput = ({
	labelText,
	inputId,
	placeholder,
	type = 'text',
	errorMessage,
	register,
	validation,
	...props
}: FormInputProps) => {
	return (
		<div className={classes.formGroup}>
			<Label htmlFor={inputId} className={classes.label}>
				{labelText}
			</Label>
			<div className={classes.inputWrapper}>
				<Input
					className={classes.input}
					placeholder={placeholder}
					id={inputId}
					type={type}
					{...register(inputId, validation)}
					{...props}
				/>
				{errorMessage && <p className={classes.errorMessage}>{errorMessage}</p>}
			</div>
		</div>
	);
};

export default FormInput;
