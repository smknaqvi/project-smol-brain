import { Request, Response, Router } from 'express';
import { io } from '../app';
const router = Router();

router.get('/validate/:id', (req: Request, res: Response) => {
  const partyID: string = req.params.id;
  const rooms = io.sockets.adapter.rooms;
  if (rooms.get(partyID)) {
    return res.status(200).json({ message: 'Valid' });
  } else {
    return res.status(404).json({ message: 'Invalid' });
  }
});

export default router;
