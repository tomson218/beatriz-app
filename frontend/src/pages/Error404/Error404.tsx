import StatusResult from '../../components/libs/StatusResult';

const Error404 = () => {
	return <StatusResult status='404' title='404' subTitle='Sorry, the page you visited does not exist.' />;
};

export default Error404;
