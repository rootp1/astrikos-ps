const mongoose = require("mongoose");

const MapSceneSchema = new mongoose.Schema({
  name: String,
  filePath: String,
  tags: [String],
  ownerId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.MapScene || mongoose.model("MapScene", MapSceneSchema);
