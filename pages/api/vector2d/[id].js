import connectDB from "../../../lib/db.js";
const VectorAsset = require("../../../models/VectorAsset");

export default async function handler(req, res) {
  await connectDB();

  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const asset = await VectorAsset.findById(id);
      if (!asset) return res.status(404).json({ error: "Not found" });
      return res.status(200).json(asset);
    } catch (err) {
      return res.status(500).json({ error: "Server error", details: err });
    }
  }

  if (req.method === "DELETE") {
    try {
      await VectorAsset.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ success: true, message: "Vector asset deleted" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
