import { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { isLoggedIn } from '../middleware/auth';
import { set, exists, get } from '../lib/redis';
import { hashPassword } from '../lib/crypto';
import { INTERNAL_ERROR_MESSAGE } from '../constants';

const router = Router();

/**
 * @api {get} /party/:id Check if a party exists
 * @apiName GetParty
 * @apiGroup Party
 * @apiDescription Check that a party exists and if it is password protected. Must have a valid session.
 *
 * @apiParam {String} id Party ID to check for
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Valid",
 *       "hasPassword": true
 *     }
 *
 * @apiError {String} error Error message
 *
 * @apiErrorExample Not Found:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Invalid"
 *     }
 *
 * @apiErrorExample Unauthorized:
 *     HTTP/1.1 401 Unauthorized
 *     {
 *       "error": "Access Denied"
 *     }
 * @apiError (Error 5xx) {String} error Error message
 *
 * @apiErrorExample Internal Server Error:
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */

router.get('/:id', isLoggedIn, (req: Request, res: Response) => {
  const partyID: string = req.params.id;
  exists(partyID)
    .then((isValid) => {
      if (isValid) {
        get(partyID, 'password')
          .then((password) => {
            const hasPassword = !!password;
            return res.status(200).json({ message: 'Valid', hasPassword });
          })
          .catch(() => {
            return res.status(500).json(INTERNAL_ERROR_MESSAGE);
          });
      } else {
        return res.status(404).json({ error: 'Invalid' });
      }
    })
    .catch(() => {
      return res.status(500).json(INTERNAL_ERROR_MESSAGE);
    });
});

/**
 * @api {put} /party/new Generate a new party
 * @apiName PutPartyNew
 * @apiGroup Party
 * @apiDescription Creates a new party for users to join. The party
 * can be password protected if a non empty password string is given.
 * Must have a valid session.
 *
 * @apiParam {String} password Room's password
 *
 * @apiSuccess {String} partyID String representing the party ID
 *
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "partyID": "92af0737-3515-4938-aa66-c768a270fec5",
 *     }
 *
 * @apiError {String} error Error message
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
 *     HTTP/1.1 500 Internal Server Error
 *     {
 *       "error": "Internal Server Error"
 *     }
 */

const genPartyID: () => Promise<string> = () => {
  const partyID = uuidv4();
  return exists(partyID).then((exists) => {
    if (exists) return genPartyID();
    else return partyID;
  });
};

router.put('/new', isLoggedIn, (req: Request, res: Response) => {
  genPartyID()
    .then((partyID) => {
      const password = req.body.password;
      if (password) {
        return hashPassword(password)
          .then((hashedPassword) => {
            return set(partyID, 'password', hashedPassword);
          })
          .then(() => {
            return set(partyID, 'created_at', JSON.stringify(new Date()));
          })
          .then(() => {
            return res.status(200).json({ partyID });
          });
      } else {
        return set(partyID, 'created_at', JSON.stringify(new Date())).then(
          () => {
            return res.status(200).json({ partyID });
          }
        );
      }
    })
    .catch(() => {
      return res.status(500).json(INTERNAL_ERROR_MESSAGE);
    });
});

export default router;
