import express from 'express';
import bodyParser from 'body-parser';
import { globalErrorHandler } from '@svdw/common';
import correlator from 'express-correlation-id';
import http from 'http';
import cors from 'cors';

const app = express();
app.use(cors());

app.use(correlator());
app.use(bodyParser.json());

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Not Found' });
});

app.use(globalErrorHandler);

const server = http.createServer(app);
export default server;
