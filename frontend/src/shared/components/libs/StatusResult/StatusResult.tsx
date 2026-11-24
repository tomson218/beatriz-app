import { Result, type ResultProps } from 'antd';

interface StatusResultProps {
	status: ResultProps['status'];
	title: string;
	subTitle: string;
}

const StatusResult = ({ status, title, subTitle }: StatusResultProps) => {
	return <Result status={status} title={title} subTitle={subTitle} />;
};

export default StatusResult;
