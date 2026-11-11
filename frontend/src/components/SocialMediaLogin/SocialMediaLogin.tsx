import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import classes from './SocialMediaLogin.module.css';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import useFacebookLoginMutation from '@/api/mutations/useFacebookLoginMutation';
import axios from 'axios';
import { API_URL } from '@/api/apiConfig';
import { setItemLocalStorage } from '../../utils/localStorage';

const SocialMediaLogin = () => {
	const navigate = useNavigate();

	const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

	const { mutate: facebookLogin } = useFacebookLoginMutation();

	const [facebookData, setFacebookData] = useState({ tokens: null, userProfile: null });

	useEffect(() => {
		if (facebookData.tokens && facebookData.userProfile) {
			facebookLogin(facebookData);
		}
	}, [facebookData]);

	return (
		<div>
			<section className={classes.googleLogin}>
				<GoogleLogin
					width={'400px'}
					onSuccess={async response => {
						try {
							const res = await axios.post(`${API_URL}/users/googleLogin`, {
								authCode: response.credential,
								clientId: response.clientId,
								selectBy: response.select_by,
							});

							setItemLocalStorage('token', res.data.token);
							setItemLocalStorage('user-id', res.data.user._id);
							navigate('/home');
						} catch (error) {
							console.error(error);
						}
					}}
					onError={() => {
						console.log('Login Failed');
					}}
					useOneTap
				/>
			</section>
			<div className='googleLogin' style={{ padding: '1rem 0' }}>
				<FacebookLogin
					appId={FACEBOOK_APP_ID}
					onSuccess={response => {
						setFacebookData(prevData => ({
							...prevData,
							tokens: response,
						}));
					}}
					onFail={error => {
						console.log('Login Failed!', error);
					}}
					onProfileSuccess={response => {
						setFacebookData(prevData => ({
							...prevData,
							userProfile: response,
						}));
					}}
					style={{
						backgroundColor: '#4267b2',
						color: '#fff',
						fontSize: '16px',
						padding: '12px 24px',
						border: 'none',
						borderRadius: '4px',
						width: '400px',
					}}
				/>
			</div>
		</div>
	);
};

export default SocialMediaLogin;
