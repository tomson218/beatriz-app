import crypto from 'crypto';
import UserModel from '../models/userModel.ts';
import AppError from '../utils/appError.ts';
import { sendEmail } from '../utils/email.ts';
import { jwtDecode } from 'jwt-decode';
import { type Request, type Response, type NextFunction } from 'express';
import type { User } from '@beatriz/shared/users';
import type {
	LoginRequest,
	AuthUserRequest,
	ForgetPasswordRequest,
	ResetPasswordParams,
	ResetPasswordRequest,
	UpdatePasswordRequest,
	GoogleLoginRequest,
	FacebookLoginRequest,
} from '@beatriz/shared/auth';
import type { UserDto } from '@beatriz/shared/users';
import { toUserDto } from '../mappers/userMapper.ts';
import {
	clearRefreshTokenCookie,
	createSendToken,
	getRefreshTokenFromRequest,
	setRefreshTokenCookie,
	signRefreshToken,
	signToken,
	verifyRefreshToken,
} from '../utils/authTokens.ts';
import { verifyFacebookToken } from '../utils/facebookAuth.ts';

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
	try {
		clearRefreshTokenCookie(res);

		res.status(200).json({
			status: 'success',
			data: null,
		});
	} catch (err) {
		next(err);
	}
};

export const signup = async (
	req: Request<{}, {}, AuthUserRequest>,
	res: Response,
	next: NextFunction,
): Promise<void | string> => {
	try {
		// OTYPOWAĆ TO

		// Rola i passwordChangedAt są ustawiane wyłącznie po stronie serwera (domyślnie role: 'user'),
		// dlatego celowo nie czytamy ich z body.
		const { username, firstName, lastName, email, password, passwordConfirm } = req.body;

		const newUser: User = await UserModel.create({
			username,
			firstName,
			lastName,
			email,
			password,
			passwordConfirm,
		});

		const newUserDto: UserDto = toUserDto(newUser);

		createSendToken(newUserDto, 201, res);

		const message: string = `Cześć ${newUser.firstName}!\n\nTwoje konto na Beatriz App jest już gotowe, a teraz przed Tobą otwierają się drzwi do koncertów, festiwali, spektakli i wielu innych wyjątkowych wydarzeń. Sprawdź, co już teraz jest w ofercie – może znajdziesz coś, co Cię zainspiruje!\n\nDo zobaczenia na widowni!\n\nZespół Beatriz App`;

		// Odpowiedź 201 została już wysłana, więc błąd wysyłki powitalnego maila może być tylko zalogowany.
		// Wywołanie next() po wysłaniu odpowiedzi kończyło się ERR_HTTP_HEADERS_SENT i wyłączeniem serwera.
		try {
			// OTYPOWAĆ TO
			await sendEmail({
				email: newUser.email,
				subject: 'Witamy w Beatriz App',
				message,
			});
		} catch (emailError) {
			console.error('Welcome email could not be sent:', emailError);
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
	let user: User | null = null;

	try {
		// OTYPOWAĆ TO
		const { email } = req.body;

		user = await UserModel.findOne({ email });

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
		const refreshToken = getRefreshTokenFromRequest(req);

		if (!refreshToken) {
			return next(new AppError('Refresh token is missing.', 401));
		}

		const decodedToken = await verifyRefreshToken(refreshToken);

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
