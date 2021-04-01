import { Request, Response, Router } from 'express';
import mongoose from 'mongoose';
import { hashPassword, verifyPassword } from '../lib/crypto';
import { ACCESS_DENIED_MESSAGE, INTERNAL_ERROR_MESSAGE } from '../constants';
import User, { UserDocument } from '../models/user.model';

const router = Router();

/**
 * @api {post} /auth/signup Create a new user account
 * @apiName PostAuthSignup
 * @apiGroup Auth
 * @apiDescription Create a new user account and sets a session cookie
 *
 * @apiParam {String} username New user's username
 * @apiParam {String} password New user's password
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User John signed up successfully",
 *     }
 *
 * @apiError {String} error Error message
 *
 * @apiErrorExample Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Missing username or password"
 *     }
 *
 * @apiErrorExample Conflict:
 *     HTTP/1.1 409 Conflict
 *     {
 *       "error": "User with username John already exists"
 *     }
 *
 * @apiError (Error 5xx) {String} error Error message
 *
 * @apiErrorExample Internal Server Error:
 *     HTTP/1.1 500 Conflict
 *     {
 *       "error": "Internal Server Error"
 *     }
 *
 */
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
        .json({ error: `User with username ${username} already exists` });
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
          .then(() => {
            req.session.username = username;
            res.cookie('username', username, {
              maxAge: 60 * 60 * 24 * 7,
              domain: process.env.ROOT_DOMAIN,
            });
            return res
              .status(200)
              .json({ message: `User ${username} signed up successfully` });
          })
          .catch((err: mongoose.Error) => {
            console.error(err);
            return res.status(500).json(INTERNAL_ERROR_MESSAGE);
          });
      })
      .catch((reason: Error) => {
        console.error(reason);
        return res.status(500).json(INTERNAL_ERROR_MESSAGE);
      });
  });
});

/**
 * @api {post} /auth/login Log in to a user's account
 * @apiName PostAuthLogin
 * @apiGroup Auth
 * @apiDescription Log into a user account and sets a session cookie
 *
 * @apiParam {String} username User's username
 * @apiParam {String} password User's password
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User John logged in successfully",
 *     }
 *
 * @apiSuccessExample Already Logged In:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "User already logged in",
 *     }
 *
 * @apiError {String} error Error message
 *
 * @apiErrorExample Bad Request:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Missing username or password"
 *     }
 *
 * @apiErrorExample Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Access Denied"
 *     }
 *
 * @apiError (Error 5xx) {String} error Error message
 *
 * @apiErrorExample Internal Server Error:
 *     HTTP/1.1 500 Conflict
 *     {
 *       "error": "Internal Server Error"
 *     }
 *
 */
router.post('/login', (req: Request, res: Response) => {
  if (req.username) {
    return res.status(200).json({ message: 'User already logged in' });
  }
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing username or password' });
  }
  User.findOne({ username }, (err: mongoose.Error, user: UserDocument) => {
    if (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_ERROR_MESSAGE);
    }
    // If user doesn't exist, we should still give access denied minimizing amount of information given out
    if (!user) return res.status(401).json(ACCESS_DENIED_MESSAGE);
    verifyPassword(password, user.hashedPassword)
      .then((isCorrect: boolean) => {
        if (!isCorrect) return res.status(401).json(ACCESS_DENIED_MESSAGE);
        req.session.username = username;
        res.cookie('username', username, {
          maxAge: 60 * 60 * 24 * 7,
          domain: process.env.ROOT_DOMAIN,
        });
        res
          .status(200)
          .json({ message: `User ${username} logged in successfully` });
      })
      .catch((reason: Error) => {
        console.error(reason);
        res.status(500).json(INTERNAL_ERROR_MESSAGE);
      });
  });
});

/**
 * @api {post} /auth/logout Logout
 * @apiName PostAuthLogout
 * @apiGroup Auth
 * @apiDescription Log out of a user's account and destory session as well as session cookie
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Logged out successfully",
 *     }
 *
 * @apiError (Error 5xx) {String} error Error message
 *
 * @apiErrorExample Internal Server Error:
 *     HTTP/1.1 500 Conflict
 *     {
 *       "error": "Internal Server Error"
 *     }
 *
 */
router.post('/logout', (req: Request, res: Response) => {
  req.session.destroy((err: Error) => {
    if (err) {
      console.error(err);
      return res.status(500).json(INTERNAL_ERROR_MESSAGE);
    }
    res.clearCookie('connect.sid', { domain: process.env.ROOT_DOMAIN });
    res.clearCookie('username', { domain: process.env.ROOT_DOMAIN });
    return res.status(200).json({ message: 'Logged out successfully' });
  });
});

export default router;
