import { RedisClient } from 'redis';
import { Request, Response } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';

export const rateLimiterMiddleware = (redisClient: RedisClient) => {
  const rateLimiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'ratelimitmiddleware',
    points: 2, // 2 points regenerated every 1 second
    duration: 1,
  });

  return (req: Request, res: Response, next: () => any) => {
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
