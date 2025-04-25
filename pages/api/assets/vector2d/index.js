// pages/api/assets/vector2d/index.js
import dbConnect from '@/lib/db';
import VectorAsset from '@/models/VectorAsset';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const assets = await VectorAsset.find({});
      res.status(200).json(assets);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch vector assets' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
