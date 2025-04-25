import { nanoid } from 'nanoid';
import connectDB from '@/lib/db';
import Scene from '@/models/Scene';

export default async function handler(req, res) {
  await connectDB();

  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const { sceneId } = req.body;
  if (!sceneId) return res.status(400).json({ error: 'Missing sceneId' });

  try {
    const token = nanoid(12);
    const updated = await Scene.findByIdAndUpdate(sceneId, { publicToken: token }, { new: true });
    if (!updated) return res.status(404).json({ error: 'Scene not found' });

    res.status(200).json({ publicUrl: `/api/share/scene/${token}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
