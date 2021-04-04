import redis from 'redis';
import { promisify } from 'util';

export const redisURI = process.env.REDIS_URI;
export const redisPort = parseInt(process.env.REDIS_PORT as string);

const redisClient = redis.createClient({
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

export default redisClient;
