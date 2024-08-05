import express from 'express';
import bodyParser from 'body-parser';
import userRoutes from './presentation/routes/userRoutes';
import { connectToDatabase } from './config';

const app = express();

app.use(bodyParser.json());
app.use('/api/users', userRoutes);

connectToDatabase();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
