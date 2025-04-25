// pages/api/assets/model3d/index.js
import dbConnect from '@/lib/db';
import ModelAsset from '@/models/ModelAsset';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    try {
      const models = await ModelAsset.find({});
      res.status(200).json(models);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Failed to fetch 3D models' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
