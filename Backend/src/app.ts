// src/app.ts

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import allRoutes from './presentation/routes/allRoutes';
import { connectToDatabase } from './config';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './presentation/socket/chat'; // Ensure this path is correct

const app = express();


import dotenv from 'dotenv';

dotenv.config();

// Middleware setup
app.use(cors({
  origin: `${process.env.CLIENT_URL}`, // Adjust as necessary
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/users', allRoutes);

// Connect to the database
connectToDatabase();

// Create an HTTP server
const httpServer = createServer(app);


// Initialize Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: `${process.env.CLIENT_URL}`, // Adjust as necessary
    methods: ['GET', 'POST'], // Allowed methods

  },

});

// Use Socket.IO handler
socketHandler(io);

// Start server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
