const formidable = require("formidable");
const fs = require("fs");
const { connectDB } = require("../../../lib/db");
const ModelAsset = require("../../../models/ModelAsset");

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Only POST allowed");

  try {
    await connectDB();

    const form = new formidable.IncomingForm({
      uploadDir: "./public/uploads/3d",
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload failed" });

      const file = files.file?.[0] || files.file;
      if (!file) return res.status(400).json({ error: "Missing file" });

      const asset = await ModelAsset.create({
        name: file.originalFilename || file.newFilename,
        filePath: `/uploads/3d/${file.newFilename}`,
        originalFormat: file.mimetype,
        tags: (fields.tags?.[0] || "").split(","),
        ownerId: fields.ownerID?.[0] || "demo",
      });

      return res.status(200).json({ status: "uploaded", asset });
    });
  } catch (err) {
    console.error("3D Upload Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
