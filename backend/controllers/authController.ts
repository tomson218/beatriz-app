import crypto from 'crypto';
import User from '../models/userModel.ts';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.ts';
import { promisify } from 'util';
import { sendEmail } from '../utils/email.ts';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export const signToken = userId => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

const createSendToken = (user, statusCode, res) => {
	const token = signToken(user._id);

	res.status(statusCode).json({
		status: 'success',
		token,
		user,
	});
};

export const restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}

		next();
	};
};

export const protect = async (req, res, next) => {
	try {
		let accessToken;

		if (req.headers.authorization?.startsWith('Bearer')) {
			accessToken = req.headers.authorization.split(' ')[1];
		}

		if (!accessToken) {
			return res.status(401).json({ status: 'fail', message: 'Access requires a login. Please log in.' });
		}
		const decodedToken = await promisify(jwt.verify)(accessToken, process.env.JWT_SECRET);

		const user = await User.findById(decodedToken.id);

		if (!user) {
			return res
				.status(401)
				.json({ status: 'fail', message: 'The user associated with this token cannot be found.' });
		}

		req.user = user;
		next();
	} catch (err) {
		res.status(500).json({ status: 'fail', message: err.message });
	}
};

export const signup = async (req, res, next) => {
	try {
		const { username, firstName, lastName, email, password, passwordConfirm, passwordChangedAt, role } = req.body;

		const newUser = await User.create({
			username,
			firstName,
			lastName,
			email,
			password,
			passwordConfirm,
			passwordChangedAt,
			role,
		});

		createSendToken(newUser, 201, res);

		const message = `Cześć ${newUser.firstName}!\n\nTwoje konto na Beatriz App jest już gotowe, a teraz przed Tobą otwierają się drzwi do koncertów, festiwali, spektakli i wielu innych wyjątkowych wydarzeń. Sprawdź, co już teraz jest w ofercie – może znajdziesz coś, co Cię zainspiruje!\n\nDo zobaczenia na widowni!\n\nZespół Beatriz App`;

		try {
			await sendEmail({
				email: newUser.email,
				subject: 'Witamy w Beatriz App',
				message,
			});
		} catch (err) {
			return next(new AppError('There was an error sending the email. Try again later', 500));
		}
	} catch (err) {
		next(err);
	}
};

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new AppError('Please provide email and password!', 400));
		}

		const user = await User.findOne({ email }).select('+password');

		if (!user || !(await user.correctPassword(password, user.password))) {
			return next(new AppError('Incorrect email or password', 401));
		}

		createSendToken(user, 200, res);
	} catch (err) {
		next(err);
	}
};

export const forgetPassword = async (req, res, next) => {
	try {
		const { email } = req.body;

		const user = await User.findOne({ email });

		if (!user) {
			return next(new AppError('There is no user with that email address.', 404));
		}

		const resetToken = user.createPasswordResetToken();

		await user.save({ validateBeforeSave: false });

		const resetURLFRONT = `http://localhost:5173/reset-password/${resetToken}`;

		const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURLFRONT}.\nIf you didn't forget your password, please ignore this email!`;

		await sendEmail({
			email: user.email,
			subject: 'Your password reset token (valid for 10 min)',
			message,
		});

		res.status(200).json({
			status: 'success',
			message: 'Token sent to email!',
		});
	} catch (err) {
		if (user) {
			user.passwordResetToken = undefined;
			user.passwordResetExpires = undefined;
			await user.save({ validateBeforeSave: false });
		}
		next(err);
	}
};

export const resetPassword = async (req, res, next) => {
	try {
		const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

		const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

		if (!user) {
			return next(new AppError('Token is invalid or has expired', 400));
		}

		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save();

		createSendToken(user, 200, res);
	} catch (err) {
		next(err);
	}
};

export const updatePassword = async (req, res, next) => {
	try {
		const user = await User.findById(req.user.id).select('+password');

		if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
			return next(new AppError('Your current password is wrong', 401));
		}

		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;

		await user.save();

		createSendToken(user, 200, res);
	} catch (err) {
		next(err);
	}
};

export const googleLogin = async (req, res, next) => {
	try {
		const { authCode, clientId, selectBy } = req.body;

		const decodedGoogleToken = jwtDecode(authCode);

		let user = await User.findOne({ email: decodedGoogleToken.email });

		if (!user) {
			user = await User.create({ email: decodedGoogleToken.email, googleId: decodedGoogleToken.sub });
			const token = signToken(user._id);
			return res.status(201).json({ status: 'success', token, user });
		}

		if (user && !user.googleId) {
			user.googleId = decodedGoogleToken.sub;
			await user.save();
		}

		const token = signToken(user._id);
		res.status(200).json({ status: 'success', token, user });
	} catch (err) {
		next(err);
	}
};

const verifyFacebookToken = async auth => {
	try {
		const FACEBOOK_URI = `https://graph.facebook.com/me?access_token=${auth.accessToken}`;

		const response = await axios.get(FACEBOOK_URI);
		const data = response.data;

		const expireToken = auth.data_access_expiration_time;

		const currentTime = Math.floor(Date.now() / 1000);

		return data.id === auth.userID && expireToken > currentTime;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const facebookLogin = async (req, res, next) => {
	try {
		const { tokens, userProfile } = req.body;

		let user = await User.findOne({ email: userProfile.email });

		const verifyToken = await verifyFacebookToken(tokens);

		if (!verifyToken) {
			return res.status(500).json({ status: 'error', message: 'Token is not valid' });
		}

		const facebookObj = {
			id: userProfile.id,
			picture: userProfile.picture.data.url,
			firstName: userProfile.name.split(' ')[0],
			lastName: userProfile.name.split(' ')[1],
		};

		if (!user) {
			user = await User.create({
				email: userProfile.email,
				facebookData: facebookObj,
			});
			const token = signToken(user._id);
			return res.status(201).json({ status: 'success', token, user });
		}

		if (user && !user.hasOwnProperty('facebook')) {
			user.facebookData = facebookObj;
			await user.save();
		}

		const token = signToken(user._id);

		res.status(200).json({
			status: 'success',
			message: 'Facebook login success',
			user,
			token,
		});
	} catch (err) {
		next(err);
		console.error('Error in Facebook login:', err);
	}
};
