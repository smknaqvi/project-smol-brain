import { RequestHandler } from 'express';
import { ACCESS_DENIED_MESSAGE } from '../constants';

export const isLoggedIn: RequestHandler = (req, res, next) => {
  if (!req.username) return res.status(401).json(ACCESS_DENIED_MESSAGE);
  next();
};
