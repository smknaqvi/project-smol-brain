import { RequestHandler } from 'express';

export const sessionParser: RequestHandler = (req, res, next) => {
  req.username = req.session.username ? req.session.username : null;
  res.cookie('username', req.username, {
    maxAge: 60 * 60 * 24 * 7,
    domain: process.env.ROOT_DOMAIN,
  });
  next();
};
