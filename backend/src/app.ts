import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import bodyParser from 'body-parser';
import { sessionParser } from './middleware/session';
import authRouter from './routes/auth';
import partyRouter from './routes/party';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { ioFunction } from './sockets/sockets';
import { promisify } from 'util';
import { promises } from 'node:dns';

dotenv.config();
const frontendOrigin = process.env.FRONTEND_ORIGIN;
const port = process.env.PORT;
const dbURI = process.env.DB_URI;
const redisURI = process.env.REDIS_URI;
const redisPort = parseInt(process.env.REDIS_PORT as string);

const corsOptions = {
  origin: frontendOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};

const app = express();
const server = createServer(app);
export const io = new Server(server, { cors: corsOptions });
const RedisStore = connectRedis(session);
export const redisClient = redis.createClient({
  host: redisURI,
  port: redisPort,
});

// god bless Paul Merrill
//https://stackoverflow.com/a/62335120
export const set = promisify(
  (redisClient.hset as unknown) as (
    key: string,
    field: string,
    value: string
  ) => Promise<number>
).bind(redisClient);

export const get = promisify(
  (redisClient.hget as unknown) as (
    key: string,
    field: string
  ) => Promise<string>
).bind(redisClient);

export const del = promisify(
  (redisClient.del as unknown) as (arg0: string) => Promise<number>
).bind(redisClient);

export const exists = promisify(
  (redisClient.exists as unknown) as (arg0: string) => Promise<boolean>
).bind(redisClient);

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET as string,
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: true,
  cookie: { domain: process.env.ROOT_DOMAIN },
});
app.use(sessionMiddleware);
ioFunction(io, sessionMiddleware);
app.use(sessionParser);
app.use(cookieParser());

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
app.use('/party', partyRouter);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello World!' });
});

server.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
