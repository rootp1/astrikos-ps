import connectDB from '@/lib/db';
import ModelAsset from '@/models/ModelAsset';

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const model = await ModelAsset.findById(id);
    if (!model) return res.status(404).json({ error: 'Model not found' });
    return res.status(200).json(model);
  }

  if (req.method === 'DELETE') {
    try {
      await ModelAsset.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: '3D model deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}