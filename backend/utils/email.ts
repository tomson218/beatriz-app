import nodemailer from 'nodemailer';

export const sendEmail = async options => {
	const transporter = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',

		auth: {
			user: process.env.GOOGLE_MAIL_USERNAME,
			pass: process.env.GOOGLE_MAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: 'tomson.studia@gmail.com',
		to: options.email,
		subject: options.subject,
		text: options.message,
		html: options.html || undefined,
		attachments: options.attachments || undefined,
	};

	await transporter.sendMail(mailOptions);
};
