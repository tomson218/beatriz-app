import crypto from 'crypto';
import UserModel from '../models/userModel.ts';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError.ts';
import { promisify } from 'util';
import { sendEmail } from '../utils/email.ts';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { type Request, type Response, type NextFunction } from 'express';
import { type User } from '../models/userModel.ts';
import type { UserDto } from '../types/users.ts';
import { toUserDto } from '../mappers/userMapper.ts';
import { Types } from 'mongoose';
import type {
	LoginRequest,
	SignUpRequest,
	ForgetPasswordRequest,
	ResetPasswordParams,
	ResetPasswordRequest,
	UpdatePasswordRequest,
	GoogleLoginRequest,
	FacebookLoginRequest,
} from '../types/auth.ts';

/* te funkcje niebedace kntrolerem wywlic dokads */

export const signToken = (userId: Types.ObjectId): string => {
	return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

export const signRefreshToken = (userId: Types.ObjectId): string => {
	return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
	});
};

const setRefreshTokenCookie = (res: Response, refreshToken: string): void => {
	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
};

const createSendToken = (user: UserDto, statusCode: number, res: Response): void => {
	const accessToken = signToken(user._id);
	const refreshToken = signRefreshToken(user._id);

	setRefreshTokenCookie(res, refreshToken);

	res.status(statusCode).json({
		status: 'success',
		data: {
			accessToken,
			user,
		},
	});
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		});

		res.status(200).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		next(err);
	}
};

// zamiast string[] to Role[]
export const restrictTo = (...roles: string[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('You do not have permission to perform this action', 403));
		}

		next();
	};
};

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		let accessToken;

		if (req.headers.authorization?.startsWith('Bearer')) {
			accessToken = req.headers.authorization.split(' ')[1];
		}

		if (!accessToken) {
			return res.status(401).json({ status: 'fail', message: 'Access requires a login. Please log in.' });
		}
		const decodedToken = await promisify(jwt.verify)(accessToken, process.env.JWT_SECRET);

		const user: User | null = await UserModel.findById(decodedToken.id);

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

/* 

{
  "username": "jan_kowalski",
  "firstName": "Jan",
  "lastName": "Kowalski",
  "email": "jan.kowalski@example.com",
  "password": "StrongPassword123!",
  "passwordConfirm": "StrongPassword123!",
  "passwordChangedAt": null,
  "role": "user"
}

*/

export const signup = async (
	req: Request<{}, {}, SignUpRequest>,
	res: Response,
	next: NextFunction,
): Promise<void | string> => {
	try {
		// OTYPOWAĆ TO

		const { username, firstName, lastName, email, password, passwordConfirm, passwordChangedAt, role } = req.body; // roli nie powinienem dodawac!!!

		const newUser: User = await UserModel.create({
			username,
			firstName,
			lastName,
			email,
			password,
			passwordConfirm,
			passwordChangedAt,
			role,
		});

		const newUserDto: UserDto = toUserDto(newUser);

		createSendToken(newUserDto, 201, res);

		const message: string = `Cześć ${newUser.firstName}!\n\nTwoje konto na Beatriz App jest już gotowe, a teraz przed Tobą otwierają się drzwi do koncertów, festiwali, spektakli i wielu innych wyjątkowych wydarzeń. Sprawdź, co już teraz jest w ofercie – może znajdziesz coś, co Cię zainspiruje!\n\nDo zobaczenia na widowni!\n\nZespół Beatriz App`;

		try {
			// OTYPOWAĆ TO
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

export const login = async (req: Request<LoginRequest>, res: Response, next: NextFunction): Promise<void> => {
	try {
		// OTYPOWAĆ TO
		const { email, password } = req.body;

		if (!email || !password) {
			return next(new AppError('Please provide email and password!', 400));
		}

		const user: User | null = await UserModel.findOne({ email }).select('+password');

		// OTYPOWAĆ TO
		if (!user || !(await user.correctPassword(password, user.password))) {
			return next(new AppError('Incorrect email or password', 401));
		}

		const userDto: UserDto = toUserDto(user);

		createSendToken(userDto, 200, res);
	} catch (err) {
		next(err);
	}
};

export const forgetPassword = async (
	req: Request<{}, {}, ForgetPasswordRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		// OTYPOWAĆ TO
		const { email } = req.body;

		const user: User | null = await UserModel.findOne({ email });

		if (!user) {
			return next(new AppError('There is no user with that email address.', 404));
		}

		// OTYPOWAĆ TO
		const resetToken = user.createPasswordResetToken();

		await user.save({ validateBeforeSave: false });

		const resetURLFRONT: string = `${process.env.CLIENT_URL}/reset-password/${resetToken}`; // to API_URL_FRONTEND

		const message: string = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURLFRONT}.\nIf you didn't forget your password, please ignore this email!`;

		// OTYPOWAĆ TO
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

export const resetPassword = async (
	req: Request<ResetPasswordParams, {}, ResetPasswordRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const hashedToken: string = crypto.createHash('sha256').update(req.params.token).digest('hex');

		const user: User | null = await UserModel.findOne({
			passwordResetToken: hashedToken,
			passwordResetExpires: { $gt: Date.now() },
		});

		if (!user) {
			return next(new AppError('Token is invalid or has expired', 400));
		}

		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;

		await user.save();

		const userDto: UserDto = toUserDto(user);

		createSendToken(userDto, 200, res);
	} catch (err) {
		next(err);
	}
};

export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		const cookies = req.headers.cookie ?? '';
		const cookieEntries = cookies.split(';').reduce<Record<string, string>>((acc, item) => {
			const [key, ...rest] = item.trim().split('=');
			if (!key || rest.length === 0) return acc;
			acc[key] = rest.join('=');
			return acc;
		}, {});

		const refreshToken = cookieEntries.refreshToken;

		if (!refreshToken) {
			return next(new AppError('Refresh token is missing.', 401));
		}

		const decodedToken = (await promisify(jwt.verify)(
			refreshToken,
			process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
		)) as {
			id: Types.ObjectId;
		};

		const user: User | null = await UserModel.findById(decodedToken.id);

		if (!user) {
			return next(new AppError('User not found for refresh token.', 401));
		}

		const userDto: UserDto = toUserDto(user);
		const newAccessToken = signToken(user._id);
		const newRefreshToken = signRefreshToken(user._id);

		setRefreshTokenCookie(res, newRefreshToken);

		res.status(200).json({
			status: 'success',
			data: {
				accessToken: newAccessToken,
				user: userDto,
			},
		});
	} catch (err) {
		next(new AppError('Invalid or expired refresh token.', 401));
	}
};

export const updatePassword = async (
	req: Request<{}, {}, UpdatePasswordRequest>,
	res: Response,
	next: NextFunction,
): Promise<void> => {
	try {
		const user: User | null = await UserModel.findById(req.user.id).select('+password');

		if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
			return next(new AppError('Your current password is wrong', 401));
		}

		user.password = req.body.password;
		user.passwordConfirm = req.body.passwordConfirm;

		await user.save();

		const userDto: UserDto = toUserDto(user);

		createSendToken(userDto, 200, res);
	} catch (err) {
		next(err);
	}
};

export const googleLogin = async (req: Request<{}, {}, GoogleLoginRequest>, res: Response, next: NextFunction) => {
	try {
		const { authCode, clientId, selectBy } = req.body;

		const decodedGoogleToken: any = jwtDecode(authCode);

		let user: any = await UserModel.findOne({ email: decodedGoogleToken.email });

		const userDto: UserDto = toUserDto(user);

		if (!user) {
			user = await UserModel.create({ email: decodedGoogleToken.email, googleId: decodedGoogleToken.sub });
			const accessToken = signToken(user._id);

			return res.status(201).json({ status: 'success', data: { accessToken, user: userDto } });
		}

		if (user && !user.googleId) {
			user.googleId = decodedGoogleToken.sub;
			await user.save();
		}

		const accessToken: any = signToken(user._id);

		res.status(200).json({
			status: 'success',
			data: {
				accessToken,
				user: userDto,
			},
		});
	} catch (err) {
		next(err);
	}
};

const verifyFacebookToken = async (auth: any): Promise<boolean> => {
	try {
		const FACEBOOK_URI: string = `https://graph.facebook.com/me?access_token=${auth.accessToken}`;

		const response = await axios.get(FACEBOOK_URI);
		const data: any = response.data;

		const expireToken: any = auth.data_access_expiration_time;

		const currentTime = Math.floor(Date.now() / 1000);

		return data.id === auth.userID && expireToken > currentTime;
	} catch (err) {
		console.log(err);
		return false;
	}
};

export const facebookLogin = async (req: Request<{}, {}, FacebookLoginRequest>, res: Response, next: NextFunction) => {
	try {
		const { tokens, userProfile } = req.body;

		let user: User | null = await UserModel.findOne({ email: userProfile.email });

		const verifyToken: any = await verifyFacebookToken(tokens);

		if (!verifyToken) {
			return res.status(500).json({ status: 'error', message: 'Token is not valid' });
		}

		type FacebookObj = {
			id: string;
			picture: string;
			firstName: string;
			lastName: string;
		};

		const facebookObj: FacebookObj = {
			id: userProfile.id,
			picture: userProfile.picture.data.url,
			firstName: userProfile.name.split(' ')[0],
			lastName: userProfile.name.split(' ')[1],
		};

		if (!user) {
			user = await UserModel.create({
				email: userProfile.email,
				facebookData: facebookObj,
			});
			const accessToken = signToken(user._id);

			const userDto: UserDto = toUserDto(user);

			return res.status(201).json({ status: 'success', data: { accessToken, user: userDto } });
		}

		if (user && !user.hasOwnProperty('facebook')) {
			user.facebookData = facebookObj;
			await user.save();
		}

		const accessToken: any = signToken(user._id);

		const userDto: UserDto = toUserDto(user);

		res.status(200).json({
			status: 'success',
			message: 'Facebook login success',
			data: {
				user: userDto,
				accessToken,
			},
		});
	} catch (err) {
		next(err);
		console.error('Error in Facebook login:', err);
	}
};
