/* node --experimental-vm-modules node_modules/jest/bin/jest.js */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import request from 'supertest';
import { server } from '../index.js';
import { jest } from '@jest/globals';
import { formattedDate, formattedTime } from '../utils/formattingDate.js';
import { signup, login, signToken } from '../controllers/authController.js';
import { jwtDecode } from 'jwt-decode';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

dotenv.config();

let mongod;

let accessToken;

jest.mock('supertest', () => {
	return {
		post: jest.fn(() => ({
			set: jest.fn().mockReturnThis(),
			send: jest.fn().mockReturnThis(),
			expect: jest.fn().mockResolvedValue({
				statusCode: 200,
				body: { newPost: { message: 'Test post', eventId: '667f19e93d1cf728a7ff0933' } },
			}),
		})),
	};
});

beforeAll(async () => {
	await mongoose.connection.on('connected', () => {
		console.log('Connected to MongoDB');
	});

	const loginRes = await request(server)
		.post('/api/users/login')
		.send({ email: 's092787@student.tu.kielce.pl', password: '12345678' });

	accessToken = loginRes.body.token;
});

describe('API', () => {
	it('Fetch tickets with authorization', async () => {
		const url = '/api/tickets/6712bb5ae030df46e2e18e66';
		const res = await request(server)
			.get(url)
			.set('Authorization', `Bearer ${accessToken}`)
			.expect('Content-Type', /json/)
			.expect(200);
	});
	it('Fetch tickets without authorization', async () => {
		const url = '/api/tickets/6712bb5ae030df46e2e18e66';
		const res = await request(server).get(url).expect('Content-Type', /json/).expect(401);
	});

	it('Add a post', async () => {
		const url = '/api/forum';
		const data = { message: 'Test post', eventId: '667f19e93d1cf728a7ff0933' };
		const res = await request(server)
			.post(url)
			.set('Authorization', `Bearer ${accessToken}`)
			.send(data)
			.expect('Content-Type', /json/);
		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('newPost');
	});
});

describe('FORMATTING AND TOKEN GENERATION', () => {
	it('Date formatting', async () => {
		const date = new Date('2024-11-30T09:00:00.000+00:00');
		const formatted = formattedDate(date);
		expect(formatted).toBe('30.11.2024');
	});

	it('Time formatting', async () => {
		const time = new Date('2024-11-30T09:00:00.000+00:00');
		const formatted = formattedTime(time);
		expect(formatted).toBe('10:00');
	});

	it('Token generation', async () => {
		const userId = '66f1acf6db91df36d262bd1f';
		const token = signToken(userId);
		const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
		expect(token).toBeDefined();
		expect(decodedToken.id).toBe(userId);
	});
});

afterAll(async () => {
	await mongoose.connection.close();
	console.log('Disconnected from MongoDB');
});
