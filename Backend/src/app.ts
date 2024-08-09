import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './presentation/routes/userRoutes';
import { connectToDatabase } from './config';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));


app.use(bodyParser.json());
app.use('/api/users', userRoutes);

connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
