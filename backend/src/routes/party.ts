import { Request, Response, Router } from 'express';
import { io } from '../app';
const router = Router();

router.post('/validate', (req: Request, res: Response) => {
  const partyID: string = req.body.partyID;
  const rooms = io.sockets.adapter.rooms;
  if (rooms.get(partyID)) {
    return res.status(200).json({ message: 'Valid' });
  } else {
    return res.status(404).json({ message: 'Invalid' });
  }
});

export default router;
