import StatusResult from '@/components/libs/StatusResult/StatusResult';

const Cancel = () => {
	return (
		<StatusResult
			status='error'
			title='Wysyłanie nieudane'
			subTitle='Sprawdź i popraw poniższe informacje przed ponownym przesłaniem.'
		/>
	);
};

export default Cancel;
