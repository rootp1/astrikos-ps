const mongoose = require("mongoose");

const VectorAssetSchema = new mongoose.Schema({
  name: String,
  filePath: String,
  originalFormat: String,
  tags: [String],
  ownerId: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports =
  mongoose.models.VectorAsset ||
  mongoose.model("VectorAsset", VectorAssetSchema);
