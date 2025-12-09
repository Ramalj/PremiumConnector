import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

const client = new Client({
    connectionString: process.env.DATABASE_URL,
});

client.connect()
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database connection error', err.stack));

app.get('/', (req, res) => {
    res.send('API Running');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
