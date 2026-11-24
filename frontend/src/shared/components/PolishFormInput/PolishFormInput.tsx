import FormInput from '@/shared/components/FormInput/FormInput';
import type { FieldValues, Path, RegisterOptions } from 'react-hook-form';
import type { ValidationMessages, ValidationRuleName } from '@/shared/types/forms';

/** A length rule whose message is optional: the component fills in a Polish message when it is missing. */
type LengthRule = number | { value: number; message?: string };

/** Validation rules like `RegisterOptions`, but `minLength` / `maxLength` may skip the message. */
type PolishValidation<T extends FieldValues> = Omit<RegisterOptions<T, Path<T>>, 'minLength' | 'maxLength'> & {
	minLength?: LengthRule;
	maxLength?: LengthRule;
};

interface PolishFormInputProps<T extends FieldValues = FieldValues>
	extends Omit<Parameters<typeof FormInput<T>>[0], 'validation' | 'error'> {
	validation?: PolishValidation<T>;
	fieldName?: string;
}

const getFieldMessage = (fieldName: string, type: ValidationRuleName) => {
	const messages: ValidationMessages = {
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

/** Sprawdza czy reguła walidacji ma postać obiektu z wartością i komunikatem (np. { value: 8, message: '...' }). */
const isRuleWithValue = (rule: unknown): rule is { value: number; message?: string } => {
	const isRuleMissing = !rule;

	if (isRuleMissing) return false;

	const isNotRuleObject = typeof rule !== 'object';

	if (isNotRuleObject) return false;

	const hasValueKey = 'value' in rule;

	return hasValueKey;
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

	const buildValidation = (v?: PolishValidation<T>): RegisterOptions<T, Path<T>> | undefined => {
		const hasNoValidation = !v;

		if (hasNoValidation) return undefined;

		const { minLength, maxLength } = v;
		const result = { ...v } as RegisterOptions<T, Path<T>>;

		const isRequiredFlag = result.required === true;
		const hasMinLengthWithValue = isRuleWithValue(minLength);
		const hasMaxLengthWithValue = isRuleWithValue(maxLength);

		if (isRequiredFlag) {
			result.required = getFieldMessage(field, 'required');
		}

		if (hasMinLengthWithValue) {
			result.minLength = {
				...minLength,
				message: getFieldMessage(field, 'minLength').replace('{min}', String(minLength.value)),
			};
		}

		if (hasMaxLengthWithValue) {
			result.maxLength = {
				...maxLength,
				message: getFieldMessage(field, 'maxLength').replace('{max}', String(maxLength.value)),
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
