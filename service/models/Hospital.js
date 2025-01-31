const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  image: {
    filename: String,
    contentType: String,
    image: Buffer,
  },
});

const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  equipment: [equipmentSchema],
});

module.exports = mongoose.model("Hospital", hospitalSchema);











