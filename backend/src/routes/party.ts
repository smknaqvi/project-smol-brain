import { Request, Response, Router } from 'express';
import { io, redisClient } from '../app';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.get('/:id', (req: Request, res: Response) => {
  const partyID: string = req.params.id;
  const rooms = io.sockets.adapter.rooms;
  if (rooms.get(partyID)) {
    return res.status(200).json({ message: 'Valid' });
  } else {
    return res.status(404).json({ message: 'Invalid' });
  }
});

router.put('/new', (req: Request, res: Response) => {
  const partyID: string = uuidv4();
  redisClient.hset(partyID, 'created_at', JSON.stringify(new Date()));
  res.json(partyID);
});
export default router;
