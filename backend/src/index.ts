import express, { Request, Response } from 'express';
import cors from 'cors';
import documentsRouter from './routes/documents';
import authRouter from './routes/auth';
import { startSyncJob } from './jobs/sync-job';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/documents', documentsRouter);
app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.send('One Stone Backend API is running!');
});

// Start the Drive sync job
startSyncJob();

app.listen(3001, () => {
  console.log('Server is running on port 3001');
}); 