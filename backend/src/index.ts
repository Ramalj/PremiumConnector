import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import googleAuthRoutes from './routes/googleAuth';
import wifiRoutes from './routes/tools/wifi';
import usersRoutes from './routes/users';

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

app.get('/', (req, res) => {
    res.send('QRPrimeGen API Running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
