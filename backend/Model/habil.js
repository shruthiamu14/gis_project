const mongoose = require('mongoose');
const plotSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    waterbodyScore: {
        type: Number
    },
    roadScore: {
        type: Number
    },
    metroScore: {
        type: Number
    },
    hospitalScore: {
        type: Number
    },
    habilScore: {
        type: Number
    },
    latitude : {
        type: Number,
        required : true
    },
    longitude : {
        type : Number,
        required: true
    },
    }
) 
const Plot = mongoose.model('Plot', plotSchema);
module.exports = Plot;