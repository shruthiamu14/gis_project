const mongoose = require('mongoose');
const featureSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Road', 'Hospital', 'Waterbody'] // Only allow these values
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    }
});
const Feature = mongoose.model('Feature', featureSchema);
module.exports = Feature;