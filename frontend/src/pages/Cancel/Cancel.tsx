import StatusResult from '../../components/libs/StatusResult';

const Cancel = () => {
	return (
		<StatusResult
			status='error'
			title='Submission Failed'
			subTitle='Please check and modify the following information before resubmitting.'
		/>
	);
};

export default Cancel;
