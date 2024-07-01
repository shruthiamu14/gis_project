const mongoose = require('mongoose');
const layerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  data: [
    {
      name: String,
      latitude: Number,
      longitude: Number,
      parameters: [Number],
      score: Number
    }
  ]
});
const Layer = mongoose.model('Layer', layerSchema);
module.exports = Layer;