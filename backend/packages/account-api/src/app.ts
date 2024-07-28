import express from 'express';
import authRoutes from './routes/auth.routes';
import bodyParser from 'body-parser';
import { globalErrorHandler } from '@svdw/common';
import correlator from 'express-correlation-id';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(correlator());
app.use(bodyParser.json());
app.use('/auth', authRoutes);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
  }),
);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

app.use(globalErrorHandler);

export default app;
