import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.DB_CONNECTION_STRING!);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
};
