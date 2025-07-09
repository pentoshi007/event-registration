import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import apiRouter from './routes';
import { autoSeed } from './seed';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb+srv://aniket00736:ak802135@cluster0.h8lwxvz.mongodb.net/evently?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGO_URI) {
  throw new Error('MONGO_URI or MONGODB_URI missing in environment variables');
}

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('MongoDB connected');
    
    // Auto-seed the database if it's empty
    await autoSeed();
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: unknown) => {
    console.error('Mongo connection error', err);
    process.exit(1);
  });

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'OK' });
});

app.use('/api', apiRouter); 