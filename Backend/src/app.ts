import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import allRoutes from './presentation/routes/allRoutes';
import { connectToDatabase } from './config';
import morgan from 'morgan';
import { createServer } from 'http'; // Import to create HTTP server
import { Server } from 'socket.io';
import { socketHandler } from '../src/presentation/socket/chat'; // Corrected path

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Adjust the origin as needed
}));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/api/users', allRoutes);

// Connect to the database
connectToDatabase();

// Create an HTTP server
const httpServer = createServer(app);

// Create a Socket.io instance and integrate it with the HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ["GET", "POST"], // Add methods allowed by CORS
  },
});

// Use the Socket.io handler
io.on('connection', socketHandler);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
