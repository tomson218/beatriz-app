import { Result } from 'antd';
import { Button } from '@/components/ui/button';

interface StatusResultProps {
	status: string;
	title: string;
	subTitle: string;
}

const StatusResult = ({ status, title, subTitle }: StatusResultProps) => {
	return (
		<Result
			status={status}
			title={title}
			subTitle={subTitle}
			colorTextHeading='red'
			colorWarning='red'
			colorTextDescription='red'
			colorSuccess='yellow'
			colorInfo='yellow'
			colorFillAlter='yellow'
			colorError='yellow'
		/>
	);
};

export default StatusResult;
