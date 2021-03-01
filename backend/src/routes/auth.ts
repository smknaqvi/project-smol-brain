import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { hashPassword, verifyPassword } from '../lib/crypto';
import { ACCESS_DENIED_MESSAGE, INTERNAL_ERROR_MESSAGE } from '../constants';

const router = express.Router();
const User = require('../models/user.model');

router.post('/signup', (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  User.findOne({ username }, (err: mongoose.Error, user: typeof User) => {
    if (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_ERROR_MESSAGE);
    }
    if (user) {
      return res
        .status(409)
        .json({ error: `User with ${username} already exists` });
    }
    hashPassword(password)
      .then((hashedPassword) => {
        const newUser = new User({
          username,
          hashedPassword,
          friends: [],
        });
        newUser
          .save()
          .then((user: typeof User) => {
            (req as any).session.username = username;
            return res
              .status(200)
              .json({ message: `User ${username} signed up successfully` });
          })
          .catch((err: mongoose.Error) => {
            console.error(err);
            return res.status(500).json(INTERNAL_ERROR_MESSAGE);
          });
      })
      .catch((reason: any) => {
        console.error(reason);
        return res.status(500).json(INTERNAL_ERROR_MESSAGE);
      });
  });
});

router.post('/login', (req: Request, res: Response) => {
  if ((req as any).username) {
    return res.status(200).json({ message: 'User already logged in' });
  }
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  User.findOne({ username }, (err: mongoose.Error, user: typeof User) => {
    if (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_ERROR_MESSAGE);
    }
    // If user doesn't exist, we should still give access denied minimizing amount of information given out
    if (!user) return res.status(401).json(ACCESS_DENIED_MESSAGE);
    verifyPassword(password, user.hashedPassword)
      .then((isCorrect: boolean) => {
        if (!isCorrect) return res.status(401).json(ACCESS_DENIED_MESSAGE);
        (req as any).session.username = username;
        res
          .status(200)
          .json({ message: `User ${username} logged in successfully` });
      })
      .catch((reason: any) => {
        console.error(reason);
        res.status(500).json(INTERNAL_ERROR_MESSAGE);
      });
  });
});

router.post('/logout', (req: Request, res: Response) => {
  (req as any).session.destroy((err: Error) => {
    if (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_ERROR_MESSAGE);
    }
    res.clearCookie('connect.sid');
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;
