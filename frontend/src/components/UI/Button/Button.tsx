import classes from './Button.module.css';

const Button = ({ classname, children, type = 'button', ...props }) => {
	return (
		<button className={`${classes.button} ${classname || ''}`} {...props} type={type}>
			{children}
		</button>
	);
};

export default Button;
