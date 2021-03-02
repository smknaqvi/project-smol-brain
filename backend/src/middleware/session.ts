import { RequestHandler } from 'express';

export const sessionParser: RequestHandler = (req, res, next) => {
  (req as any).username = (req as any).session.username
    ? (req as any).session.username
    : null;
  next();
};
