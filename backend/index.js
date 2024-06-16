const express = require('express');
const mongoose = require('mongoose');
const Plot = require('./Model/habil');
const Feature = require('./Model/feature');
const cors = require('cors');
const multer = require('multer');
const xlsx = require('xlsx');
const Layer = require('./Model/layer');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const port = 3030;

const mongoURI = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post('/addplot', async(req,res) => {
    console.log(req.body)
        const{name,waterbodyScore, roadScore, hospitalScore, metroScore, latitude, longitude} = req.body;
        const habilScore = (waterbodyScore + metroScore +hospitalScore + roadScore ) / 4; 
        console.log(habilScore)
        const newplot = new Plot ({name,waterbodyScore,roadScore,hospitalScore,metroScore,habilScore,latitude,longitude})
        console.log(newplot)
    try{
        
        await newplot.save();
        res.status(201).send(newplot);
    }catch(err){
        res.status(400).send(err);
    }
})
app.get('/getplot', async(req,res) => {
    try{

        const plot = await Plot.find({});
        console.log(plot)
        res.status(200).send(plot);
    }
    catch(err){
        res.status(400).send(err);
    }
}) 
app.put('/updateplot', async(req,res) =>{
    const{_id, name,waterbodyScore, roadScore, hospitalScore, metroScore, latitude, longitude} = req.body;
    const habilScore = (waterbodyScore + metroScore +hospitalScore + roadScore ) / 4; 
    const replacementplot = {name, waterbodyScore, roadScore, hospitalScore, metroScore, habilScore, latitude,longitude}
    try {
        const resultplot = await Plot.replaceOne({_id : _id}, replacementplot)
        res.status(200).send(resultplot);
    } catch (err) {
        res.status(400).send(err);
    }
    }
)
app.delete('/deleteplot',async(req,res)=>{
    const {_id} = req.body;
    try {
        const deleteplot = await Plot.findByIdAndDelete({_id:_id})
        res.status(200).send(deleteplot);
    } catch (err) {
        res.status(400).send(err);
    }
})



// Add feature
app.post('/addfeature', async(req,res) => {
    const {name, category, latitude, longitude} = req.body;
    const newFeature = new Feature({name, category, latitude, longitude});
    try{
        await newFeature.save();
        res.status(201).send(newFeature);
    }catch(err){
        res.status(400).send(err);
    }
})

// Get all features
app.get('/getfeature', async(req,res) => {
    try{
        const feature = await Feature.find({});
        res.status(200).send(feature);
    }
    catch(err){
        res.status(400).send(err);
    }
})

// Get features by category
app.get('/getfeature/:category', async(req,res) => {
    try{
        const feature = await Feature.find({category: req.params.category});
        res.status(200).send(feature);
    }
    catch(err){
        res.status(400).send(err);
    }
})



app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        const layerName = req.body.layerName || sheetName;
        const data = jsonData.map(row => {
            const { name, latitude, longitude, ...params } = row;
            const parameters = Object.values(params).map(Number);
            const score = parameters.reduce((acc, val) => acc + val, 0) / parameters.length;
            return { name, latitude, longitude, parameters, score };
        });

        const newLayer = new Layer({ name: layerName, data });
        await newLayer.save();

        res.status(201).send(newLayer);
    } catch (err) {
        console.error(err);
        res.status(400).send(err);
    }
});

// Get all layers
app.get('/layers', async (req, res) => {
    try {
        const layers = await Layer.find({});
        res.status(200).send(layers);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get a specific layer by ID
app.get('/layers/:id', async (req, res) => {
    try {
        const layer = await Layer.findById(req.params.id);
        if (!layer) {
            return res.status(404).send('Layer not found');
        }
        res.status(200).send(layer);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.put('/layers/:id', async (req, res) => {
    try {
        const { name, data } = req.body;
        const updatedLayer = await Layer.findByIdAndUpdate(req.params.id, { name, data }, { new: true });
        res.status(200).send(updatedLayer);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.delete('/layers/:id', async (req, res) => {
    try {
        const deletedLayer = await Layer.findByIdAndDelete(req.params.id);
        res.status(200).send(deletedLayer);
    } catch (err) {
        res.status(400).send(err);
    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});


