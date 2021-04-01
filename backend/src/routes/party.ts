import { Request, Response, Router } from 'express';
import { io, redisClient } from '../app';
import { v4 as uuidv4 } from 'uuid';
import { set, exists } from '../app';
import { isLoggedIn } from '../middleware/auth';
const router = Router();

/**
 * @api {get} /party/:id check if a party exists
 * @apiName GetParty
 * @apiGroup Party
 * @apiDescription Check that a party exists. Must have a valid session.
 *
 * @apiParam {String} id Party ID to check for
 *
 * @apiSuccess {String} message Success message
 *
 * @apiSuccessExample Success Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "message": "Valid",
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
 */

router.get('/:id', isLoggedIn, (req: Request, res: Response) => {
  const partyID: string = req.params.id;
  const rooms = io.sockets.adapter.rooms;
  if (rooms.get(partyID)) {
    return res.status(200).json({ message: 'Valid' });
  } else {
    return res.status(404).json({ error: 'Invalid' });
  }
});

/**
 * @api {put} /party/new Generate a new party
 * @apiName PutPartyNew
 * @apiGroup Party
 * @apiDescription Creates a new party for users to join. Must have a valid session.
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
 */

router.put('/new', isLoggedIn, async (req: Request, res: Response) => {
  let partyIDexists = true;
  let partyID = '';
  while (partyIDexists) {
    partyID = uuidv4();
    if (!(await exists(partyID))) {
      partyIDexists = false;
    }
  }

  await set(partyID, 'created_at', JSON.stringify(new Date()));
  res.json({ partyID });
});
export default router;
