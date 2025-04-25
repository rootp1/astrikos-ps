import connectDB from "../../../lib/db.js";
import MapScene from "../../../models/MapScene";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === 'GET') {
    const map = await MapScene.findById(id);
    if (!map) return res.status(404).json({ error: 'Map not found' });
    return res.status(200).json(map);
  }

  if (req.method === 'DELETE') {
    try {
      await MapScene.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Map deleted' });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}