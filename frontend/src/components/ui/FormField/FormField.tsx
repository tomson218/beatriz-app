import * as React from 'react';

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/Label/Label';

interface FormFieldProps {
	label: string;
	htmlFor?: string;
	labelClassName?: string;
	childrenClassName?: string;
	children: React.ReactNode;
}

const FormField = ({ label, htmlFor, labelClassName, childrenClassName, children }: FormFieldProps) => {
	return (
		<div className='grid grid-cols-4 items-center gap-4'>
			<Label htmlFor={htmlFor} className={cn('text-right', labelClassName)}>
				{label}
			</Label>
			<div className={cn('col-span-3', childrenClassName)}>{children}</div>
		</div>
	);
};

export { FormField };
export type { FormFieldProps };
