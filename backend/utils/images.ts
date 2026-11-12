import multer from 'multer';
import { type Request } from 'express';

const multerFilter = (req: Request, file: any, cb: any) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new Error('This is not an image!'), false);
	}
};

const multerStorage = multer.diskStorage({
	destination: (req: Request, file: any, cb: any) => {
		cb(null, 'public/images/events');
	},
	filename: (req: Request, file: any, cb: any) => {
		const extension = file.mimetype.split('/')[1];

		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);

		cb(null, `event-${uniqueSuffix}.${extension}`);
	},
});

const upload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});

export const uploadEventImage = upload.single('image');
