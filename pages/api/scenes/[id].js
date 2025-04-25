import { connectDB } from "../../../lib/db";
import Scene from "../../../models/Scene";

export default async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  if (req.method === "GET") {
    const scene = await Scene.findById(id);
    if (!scene) return res.status(404).json({ error: "Scene not found" });
    res.status(200).json(scene);
  }

  if (req.method === "PUT") {
    const updated = await Scene.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updated);
  }
}
