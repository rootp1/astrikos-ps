const formidable = require("formidable");
const fs = require("fs");
import connectDB from "../../../lib/db.js";
const VectorAsset = require("../../../models/VectorAsset");

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
      uploadDir: "./public/uploads/2d",
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Form parsing error:", err);
        return res.status(500).json({ error: "Form parsing failed" });
      }

      console.log("Parsed fields:", fields);
      console.log("Parsed files:", files);

      const file = files.filePath?.[0]; 

      if (!file) {
        return res.status(400).json({ error: "Missing file" });
      }

      const asset = await VectorAsset.create({
        name: fields.name?.[0] || "Untitled",
        filePath: `/uploads/2d/${file.newFilename}`,
        originalFormat: fields.originalFormat?.[0] || "unknown",
        tags: fields.tags ? fields.tags.map((tag) => tag.trim()) : [],
        ownerId: fields.ownerId?.[0] || "demo",
      });

      return res.status(200).json({ status: "uploaded", asset });
    });
  } catch (err) {
    console.error("Unhandled error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
