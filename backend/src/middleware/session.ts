import { Request, Response } from 'express';

export const sessionParser = (req: Request, res: Response, next: Function) => {
  (req as any).username = (req as any).session.username
    ? (req as any).session.username
    : null;
  next();
};
