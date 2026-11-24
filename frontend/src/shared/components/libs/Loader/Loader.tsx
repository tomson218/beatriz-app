import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
	return (
		<RotatingLines
			visible={true}
			width='96'
			strokeColor='orange'
			strokeWidth='5'
			animationDuration='0.75'
			ariaLabel='rotating-lines-loading'
		/>
	);
};
export default Loader;
