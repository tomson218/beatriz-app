import EventModel from '../models/eventModel.ts';
import AppError from '../utils/appError.ts';
import multer from 'multer';
import { type Request, type Response, type NextFunction } from 'express';

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

const calcDiscountPrice = (eventDate: Date) => {
	const daysUntilEvent = Math.floor((new Date(eventDate) - Date.now()) / (1000 * 60 * 60 * 24));

	if (daysUntilEvent >= 90) {
		return 0.25;
	} else if (daysUntilEvent >= 60) {
		return 0.15;
	} else if (daysUntilEvent >= 30) {
		return 0.1;
	} else if (daysUntilEvent >= 20) {
		return 1.1;
	} else if (daysUntilEvent >= 10) {
		return 1.2;
	} else if (daysUntilEvent >= 5) {
		return 1.3;
	}

	return 0;
};

const calcPricesAfterDiscount = (discount: number, prices: any) => {
	const discountedEntries = Object.entries(prices).map(([key, value]) => {
		if (discount >= 1) {
			return [key, Math.ceil(value * discount)];
		} else {
			return [key, Math.ceil(value - value * discount)];
		}
	});

	return Object.fromEntries(discountedEntries);
};

export const getAllEvents = async (req: Request, res: Response) => {
	try {
		const events = await EventModel.find({ date: { $gte: new Date() } })
			.sort({ date: 1 })
			.lean();

		const updatedEvents = events.map(event => {
			const discount = calcDiscountPrice(event.date);
			const newPrices = calcPricesAfterDiscount(discount, event.prices);
			return { ...event, discount, prices: newPrices };
		});

		res.status(200).json({
			events: updatedEvents,
		});
	} catch (error) {
		res.status(500).json({
			status: 'error',
			message: 'Internal Server Error',
		});
	}
};

export const getEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;

		const event = await EventModel.findById(id).select('-__v').lean();

		event.discount = calcDiscountPrice(event.date);

		const newPrice = calcPricesAfterDiscount(event.discount, event.prices);

		event.prices = newPrice;

		res.status(200).json({
			status: 'success',
			event,
		});
	} catch (err) {
		next(err);
	}
};

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		console.log(req.body);

		const { date, description, child, normal, seatRequired, sectors, star, vip, name, type } = req.body;

		const formattedStar = star.split(',').map(item => item.trim());

		const sectorsArray = sectors.split(',').map(sector => sector.trim());

		const newEvent = await EventModel.create({
			date,
			description,
			prices: {
				child: +child,
				normal: +normal,
				VIP: +vip,
			},
			image: req.file.filename,
			name,
			type,
			seatRequired,
			sectors: sectorsArray,
			star: formattedStar,
		});

		const file = req.file;

		res.status(201).json({
			status: 'success',
			newEvent,
			file,
		});
	} catch (err) {
		next(err);
	}
};

export const deleteEvent = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.params;

	const event = await EventModel.findByIdAndDelete(id);

	if (!event) {
		return next(new AppError('No event found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const updateEvent = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		const { description } = req.body;

		const updatedEvent = await EventModel.findByIdAndUpdate(id, { description });

		if (!updatedEvent) {
			return next(new AppError('No event found with that ID', 404));
		}

		res.status(200).json({
			status: 'success',
			updatedEvent,
		});
	} catch (err) {
		next(err);
	}
};
