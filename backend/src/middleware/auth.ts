import { Request, Response } from 'express';
import { ACCESS_DENIED_MESSAGE } from '../constants';

export const isLoggedIn = (req: Request, res: Response, next: Function) => {
  if (!(req as any).username)
    return res.status(401).json(ACCESS_DENIED_MESSAGE);
  next();
};
