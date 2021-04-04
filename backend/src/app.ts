import express from 'express';
import { createServer } from 'http';
import bodyParser from 'body-parser';
import { sessionParser } from './middleware/session';
import authRouter from './routes/auth';
import partyRouter from './routes/party';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import connectRedis from 'connect-redis';
import cookieParser from 'cookie-parser';
import { rateLimiterMiddleware } from './middleware/ratelimit';
import redisClient from './lib/redis';
import { createSocketServerOnce } from './sockets/sockets';

dotenv.config();
const frontendOrigin = process.env.FRONTEND_ORIGIN;
const port = process.env.PORT;
const dbURI = process.env.DB_URI;

const corsOptions = {
  origin: frontendOrigin,
  credentials: true,
  optionsSuccessStatus: 200,
};

const RedisStore = connectRedis(session);
const rateLimiter = rateLimiterMiddleware(redisClient);
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET as string,
  store: new RedisStore({ client: redisClient }),
  resave: false,
  saveUninitialized: true,
  cookie: { domain: process.env.ROOT_DOMAIN },
});

const app = express();
const server = createServer(app);
createSocketServerOnce(server, corsOptions, sessionMiddleware);

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(sessionMiddleware);
app.use(sessionParser);
app.use(cookieParser());

mongoose.connect(dbURI as string, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;
connection.once('open', () => {
  // eslint-disable-next-line no-console
  console.log('MongoDB Database connection successful!');
});

app.use(express.static('apidocs'));
app.use('/auth', rateLimiter, authRouter);
app.use('/party', rateLimiter, partyRouter);

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening at http://localhost:${port}`);
});
