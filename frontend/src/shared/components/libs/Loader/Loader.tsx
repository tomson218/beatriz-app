import { RotatingLines } from 'react-loader-spinner';

const Loader = () => {
	return (
		<RotatingLines
			visible={true}
			height='96'
			width='96'
			strokeColor='orange'
			strokeWidth='5'
			animationDuration='0.75'
			ariaLabel='rotating-lines-loading'
			wrapperStyle={{ backgroundColor: 'white' }}
			wrapperClass=''
		/>
	);
};
export default Loader;
