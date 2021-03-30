import { Request, Response, Router } from 'express';
import { io, redisClient } from '../app';
import { v4 as uuidv4 } from 'uuid';
import { set, exists } from '../app';

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

router.put('/new', async (req: Request, res: Response) => {
  let partyIDexists = true;
  let partyID = '';
  while (partyIDexists) {
    partyID = uuidv4();
    if (!(await exists(partyID))) {
      partyIDexists = false;
    }
  }

  await set(partyID, 'created_at', JSON.stringify(new Date()));
  res.json(partyID);
});
export default router;
