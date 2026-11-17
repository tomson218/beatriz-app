import FormInput from '@/components/FormInput/FormInput';
import type { FieldValues, RegisterOptions, Path } from 'react-hook-form';

interface PolishFormInputProps<T extends FieldValues = FieldValues>
	extends Omit<Parameters<typeof FormInput<T>>[0], 'validation' | 'error'> {
	validation?: RegisterOptions<T>;
	fieldName?: string;
}

const getFieldMessage = (fieldName: string, type: 'required' | 'minLength' | 'maxLength' | 'validate') => {
	const messages: Record<string, Record<string, string>> = {
		required: {
			default: 'To pole jest wymagane',
		},
		minLength: {
			default: `Pole musi składać się z co najmniej {min} znaków`,
		},
		maxLength: {
			default: `Pole nie może przekraczać {max} znaków`,
		},
		validate: {
			default: 'Wartość jest nieprawidłowa',
		},
	};

	return messages[type]?.[fieldName] || messages[type]?.default || '';
};

const PolishFormInput = <T extends FieldValues>({
	labelText,
	inputId,
	placeholder,
	type = 'text',
	register,
	validation,
	className,
	fieldName,
	...props
}: PolishFormInputProps<T>) => {
	const field = fieldName || labelText;

	const buildValidation = (v?: RegisterOptions<T>): RegisterOptions<T> | undefined => {
		if (!v) return undefined;

		const result: RegisterOptions<T> = { ...v };

		if (result.required === true) {
			result.required = getFieldMessage(field, 'required');
		}

		if (result.minLength && typeof result.minLength === 'object' && 'value' in result.minLength) {
			const minVal = result.minLength.value;
			result.minLength = {
				...result.minLength,
				message: getFieldMessage(field, 'minLength').replace('{min}', String(minVal)),
			};
		}

		if (result.maxLength && typeof result.maxLength === 'object' && 'value' in result.maxLength) {
			const maxVal = result.maxLength.value;
			result.maxLength = {
				...result.maxLength,
				message: getFieldMessage(field, 'maxLength').replace('{max}', String(maxVal)),
			};
		}

		return result;
	};

	return (
		<FormInput<T>
			labelText={labelText}
			inputId={inputId}
			placeholder={placeholder}
			type={type}
			register={register}
			validation={buildValidation(validation)}
			className={className}
			{...props}
		/>
	);
};

export default PolishFormInput;
