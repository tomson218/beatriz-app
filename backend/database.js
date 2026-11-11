import mongoose from 'mongoose';
import express from 'express';

const database = express();

const DATABASE = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose.connect(DATABASE, {}).then(() => console.log('DB connection successful!'));

export default database;
