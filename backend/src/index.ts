import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import googleAuthRoutes from './routes/googleAuth';
import wifiRoutes from './routes/tools/wifi';
import usersRoutes from './routes/users';
import plansRoutes from './routes/plans';
import featuresRoutes from './routes/features';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth/google', googleAuthRoutes);
app.use('/api/wifi', wifiRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/plans', plansRoutes);
app.use('/api/features', featuresRoutes);

app.get('/', (req, res) => {
    res.send('QRPrimeGen API Running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
