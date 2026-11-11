import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ModalProps {
	title: string;
	content: string;
	onClick: () => void;
}

const Modal = ({ title, content, onClick }: ModalProps) => {
	return (
		<>
			<Card
				style={{
					position: 'fixed',
					top: '50%',
					left: '50%',
					width: 'auto',
					maxWidth: '600px',
					transform: 'translate(-50%, -50%)',
					backgroundColor: '#ff4d4d',
					boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
					border: '2px solid black',
					borderRadius: '1rem',
					padding: '20px',
					color: '#fff',
					fontFamily: 'Roboto',
				}}
				onClick={onClick}>
				<CardHeader style={{ marginBottom: '20px', textAlign: 'center' }}>
					<CardTitle
						style={{
							fontSize: '1.5rem',
							fontWeight: 'bold',
							textTransform: 'uppercase',
							letterSpacing: '3px',
						}}>
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent style={{ marginBottom: '20px', textAlign: 'center' }}>
					<p>{content}</p>
				</CardContent>
				<CardFooter>
					<form method='dialog'>
						<Button
							variant='outline'
							onClick={onClick}
							style={{
								border: 'none',
								color: '#000',
								padding: '10px 20px',
								fontSize: '1rem',
								borderRadius: '4px',
								cursor: 'pointer',
								boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
								display: 'block',
								marginLeft: 'auto',
							}}>
							OK
						</Button>
					</form>
				</CardFooter>
			</Card>
		</>
	);
};

export default Modal;
