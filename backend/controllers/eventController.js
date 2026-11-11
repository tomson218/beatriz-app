import Event from './../models/eventModel.js';
import AppError from './../utils/appError.js';
import multer from 'multer';

const multerFilter = (req, file, cb) => {
	if (file.mimetype.startsWith('image')) {
		cb(null, true);
	} else {
		cb(new Error('This is not an image!'), false);
	}
};

const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/events');
	},
	filename: (req, file, cb) => {
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

const calcDiscountPrice = eventDate => {
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

const calcPricesAfterDiscount = (discount, prices) => {
	const discountedEntries = Object.entries(prices).map(([key, value]) => {
		if (discount >= 1) {
			return [key, Math.ceil(value * discount)];
		} else {
			return [key, Math.ceil(value - value * discount)];
		}
	});

	return Object.fromEntries(discountedEntries);
};

export const getAllEvents = async (req, res) => {
	try {
		const events = await Event.find({ date: { $gte: new Date() } })
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

export const getEvent = async (req, res, next) => {
	try {
		const { id } = req.params;

		const event = await Event.findById(id).select('-__v').lean();

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

export const createEvent = async (req, res, next) => {
	try {
		console.log(req.body);

		const { date, description, child, normal, seatRequired, sectors, star, vip, name, type } = req.body;

		const formattedStar = star.split(',').map(item => item.trim());

		const sectorsArray = sectors.split(',').map(sector => sector.trim());

		const newEvent = await Event.create({
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

export const deleteEvent = async (req, res, next) => {
	const { id } = req.params;

	const event = await Event.findByIdAndDelete(id);

	if (!event) {
		return next(new AppError('No event found with that ID', 404));
	}

	res.status(204).json({
		status: 'success',
		data: null,
	});
};

export const updateEvent = async (req, res, next) => {
	try {
		const { id } = req.params;
		const { description } = req.body;

		const updatedEvent = await Event.findByIdAndUpdate(id, { description });

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
