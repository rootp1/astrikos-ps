const formidable = require("formidable");
const fs = require("fs");
import connectDB from "../../../lib/db.js";
const MapScene = require("../../../models/MapScene.js");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  await connectDB();

  const form = new formidable.IncomingForm({
    uploadDir: "./public/uploads/maps",
    keepExtensions: true,
  });

  try {
    const { fields, files } = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve({ fields, files });
      });
    });

    // 🧼 Clean up field values (extract first from array)
    const cleanFields = Object.fromEntries(
      Object.entries(fields).map(([key, value]) => [key, value[0]])
    );

    console.log("Cleaned fields:", cleanFields);
    console.log("Original files:", files);
    const file = files.filePath?.[0] || files.filePath;
    console.log("Parsed files:", files);
    if (!file) return res.status(400).json({ error: "Missing file" });

    const asset = await MapScene.create({
      name: cleanFields.name || file.originalFilename || file.newFilename,
      filePath: `/uploads/maps/${file.newFilename}`,
      tags: cleanFields.tags?.split(",") || [],
      ownerId: cleanFields.ownerId || "demo",
    });

    return res.status(200).json({ status: "uploaded", asset });
  } catch (err) {
    console.error("Map Upload Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
