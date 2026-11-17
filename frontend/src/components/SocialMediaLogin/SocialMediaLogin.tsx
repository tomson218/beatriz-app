import { GoogleLogin } from '@react-oauth/google';
import FacebookLogin from '@greatsumini/react-facebook-login';
import classes from './SocialMediaLogin.module.css';
import { useState, useEffect } from 'react';
import useFacebookLoginMutation from '@/api/mutations/useFacebookLoginMutation';
import useGoogleLoginMutation from '@/api/mutations/useGoogleLoginMutation';
import type { FacebookLoginData } from '@beatriz/shared/auth';
import { isFacebookDataReady } from '@/utils/auth';

const SocialMediaLogin = () => {
	const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

	const { mutate: facebookLogin } = useFacebookLoginMutation();
	const { mutate: googleLogin } = useGoogleLoginMutation();

	const [facebookData, setFacebookData] = useState<FacebookLoginData>({ tokens: null, userProfile: null });

	useEffect(() => {
		if (isFacebookDataReady(facebookData)) {
			facebookLogin(facebookData);
		}
	}, [facebookData]);

	return (
		<section>
			<section className={classes.googleLogin}>
				<GoogleLogin
					width={'400px'}
					onSuccess={response => {
						googleLogin({
							authCode: response.credential,
							clientId: response.clientId,
							selectBy: response.select_by,
						});
					}}
 				onError={() => {
 					console.log('Logowanie nieudane');
 				}}
					useOneTap
				/>
			</section>
			<aside className={classes['facebook-login-container']}>
				<FacebookLogin
					appId={FACEBOOK_APP_ID}
					onSuccess={response => {
						setFacebookData(prevData => ({
							...prevData,
							tokens: response,
						}));
					}}
					onFail={error => {
						console.log('Logowanie nieudane!', error);
					}}
					onProfileSuccess={response => {
						setFacebookData(prevData => ({
							...prevData,
							userProfile: response,
						}));
					}}
					className={classes['facebook-button']}
				/>
			</aside>
		</section>
	);
};

export default SocialMediaLogin;
