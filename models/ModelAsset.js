const mongoose = require("mongoose");

const ModelAssetSchema = new mongoose.Schema({
  name: String,
  filePath: String,
  originalFormat: String,
  tags: [String],
  ownerId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.ModelAsset ||
  mongoose.model("ModelAsset", ModelAssetSchema);
