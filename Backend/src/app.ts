import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import allRoutes from './presentation/routes/allRoutes';
import { connectToDatabase } from './config';
import morgan from "morgan"

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:5173'
}));
app.use(morgan("dev"))

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));




app.use(bodyParser.json());
app.use('/api/users', allRoutes);

connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
