import connectDB from '@/lib/db';
import Scene from '@/models/Scene';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const scene = await Scene.findById(id);
      if (!scene) return res.status(404).json({ error: 'Scene not found' });

      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=scene-${id}.json`);
      res.status(200).json(scene);
    } catch (err) {
      console.error('Export failed:', err);
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
