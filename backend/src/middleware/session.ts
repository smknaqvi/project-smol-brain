import { RequestHandler } from 'express';

export const sessionParser: RequestHandler = (req, res, next) => {
  req.username = req.session.username ? req.session.username : null;
  next();
};
