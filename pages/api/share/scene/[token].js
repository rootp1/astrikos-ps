import connectDB from '@/lib/db';
import Scene from '@/models/Scene';

export default async function handler(req, res) {
  await connectDB();
  const { token } = req.query;

  try {
    const scene = await Scene.findOne({ publicToken: token });
    if (!scene) return res.status(404).json({ error: 'Scene not found' });
    res.status(200).json(scene);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
