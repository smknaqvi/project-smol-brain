import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { sessionParser } from './middleware/session';
import { isLoggedIn } from './middleware/auth';
import authRouter from './routes/auth';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';

dotenv.config();
const app = express();
const port = process.env.PORT;
const dbURI = process.env.DB_URI;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(sessionParser);

mongoose.connect(dbURI as string, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB Database connection successful!');
});

app.use('/auth', authRouter);

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

app.get('/protected', isLoggedIn, (req: Request, res: Response) => {
  res.json(`You're logged in as ${(req as any).username}!`);
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
