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
const urls = new Map<string, string>();
export const io = new Server(server, { cors: corsOptions });
const RedisStore = connectRedis(session);
const redisClient = redis.createClient({ host: redisURI, port: redisPort });

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
ioFunction(io, urls, sessionMiddleware);
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
