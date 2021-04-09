import { RedisClient } from 'redis';
import { RequestHandler } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export const rateLimiterMiddleware = (
  redisClient: RedisClient
): RequestHandler => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimitmiddleware',
    points: 4, // 4 points regenerated every 1 second
    duration: 1,
  });

  return (req, res, next) => {
    rateLimiter
      .consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
  };
};
