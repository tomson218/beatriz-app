import StatusResult from '@/components/libs/StatusResult';

const Error404 = () => {
	return <StatusResult status='404' title='404' subTitle='Przepraszamy, strona, którą odwiedziłeś, nie istnieje.' />;
};

export default Error404;
