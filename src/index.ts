import express from 'express';
import { Request, Response, Express } from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import { authRouter } from './routes/auth.routes';
import { recordsRouter } from './routes/records.routes';
import { errorHandler } from './middlewares/error.middleware';
import { sseHandler } from './realtime/sse';

export const app = express();
app.use(json());
app.use(cors());
app.use(morgan('dev')); // Logging HTTP requests


app.use('/login', authRouter);
app.use('/records', recordsRouter);

// SSE endpoint remains
app.get('/sse/health-updates', sseHandler);



app.get('/', (req: Request, res: Response) => {
  res.send('API is running');
});

app.use(errorHandler);
