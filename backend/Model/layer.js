const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: String,
    latitude: Number,
    longitude: Number,
    parameters: [Number],
    score: Number
});

const layerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    data: [dataSchema]
});

const Layer = mongoose.model('Layer', layerSchema);
module.exports = Layer;
