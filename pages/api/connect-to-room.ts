import { NextApiRequest, NextApiResponse } from 'next';
import { getRoomByCode } from '../../services/roomService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { room_number } = req.body;
      const connectedRoom = await getRoomByCode(room_number);

      if (connectedRoom) {
        res.status(200).json(connectedRoom);
      } else {
        res.status(404).json({ error: 'Room not found' });
      }
    } catch (error) {
      console.error('Error connecting to room:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
