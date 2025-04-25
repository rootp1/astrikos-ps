import { connectDB } from "../../../lib/db";
import Scene from "../../../models/Scene";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    try {
      const scene = await Scene.create(req.body);
      res.status(200).json(scene);
    } catch (err) {
      res.status(500).json({ error: "Failed to create scene", details: err.message });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
