import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import allRoutes from './presentation/routes/allRoutes'; 
import { connectToDatabase } from './config';
import morgan from 'morgan';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { socketHandler } from './presentation/socket/chat';
import dotenv from 'dotenv';
// import path from 'path';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware setup
app.use(cors({
  origin: process.env.CLIENT_URL || '*', 
}));
app.use(morgan('dev'));
app.use(bodyParser.json());

// Routes setup
app.use('/api/users', allRoutes); 

// Connect to the database
connectToDatabase();

// Create an HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || '*', 
    methods: ['GET', 'POST'], 
  },
});

// Use Socket.IO handler
socketHandler(io);

// // Serve static files in production
// if (process.env.NODE_ENV === 'production') {
//   // Correct path to the Frontend build folder
//   app.use(express.static(path.join(__dirname, '../../Frontend/build')));

//   // All other routes serve the React app
//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../../Frontend', 'build', 'index.html'));
//   });
// }

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
