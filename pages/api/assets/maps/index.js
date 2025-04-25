// pages/api/assets/maps/index.js
import dbConnect from '@/lib/db';
import MapScene from '@/models/MapScene';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const maps = await MapScene.find({});
      res.status(200).json(maps);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch maps' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
