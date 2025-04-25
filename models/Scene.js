const mongoose = require("mongoose");

const SceneSchema = new mongoose.Schema({
  name: String,
  description: String,
  ownerId: String,
  createdAt: { type: Date, default: Date.now },
  assets: [
    {
      assetId: String,         // ID of the vector/3D/map
      type: String,            // "2d" | "3d" | "map"
      position: { x: Number, y: Number, z: Number },
      rotation: { x: Number, y: Number, z: Number },
      scale: { x: Number, y: Number, z: Number },
    },
  ],
  publicToken: { type: String, unique: true, sparse: true },
});

module.exports =
  mongoose.models.Scene || mongoose.model("Scene", SceneSchema);
