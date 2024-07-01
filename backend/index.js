const express = require('express');
const mongoose = require('mongoose');
const Plot = require('./Model/habil');
const Feature = require('./Model/feature');
const Layer = require('./Model/layer'); // Layer model
const cors = require('cors');
const multer = require('multer');
const xml2js = require('xml2js');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');
require('dotenv').config();

let shp;
import('shpjs').then(module => {
  shp = module.default;
}).catch(err => console.error(err));

const app = express();
app.use(cors());
app.use(express.json());
const port = 3030;

const mongoURI = process.env.MONGODB_CONNECTION_STRING;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Multer setup for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Add plot
app.post('/addplot', async (req, res) => {
  const { name, waterbodyScore, roadScore, hospitalScore, metroScore, latitude, longitude } = req.body;
  const habilScore = (waterbodyScore + metroScore + hospitalScore + roadScore) / 4;

  const newPlot = new Plot({
    name,
    waterbodyScore,
    roadScore,
    hospitalScore,
    metroScore,
    habilScore,
    latitude,
    longitude
  });

  try {
    await newPlot.save();
    res.status(201).send(newPlot);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all plots
app.get('/getplot', async (req, res) => {
  try {
    const plots = await Plot.find({});
    res.status(200).send(plots);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Update plot
app.put('/updateplot', async (req, res) => {
  const { _id, name, waterbodyScore, roadScore, hospitalScore, metroScore, latitude, longitude } = req.body;
  const habilScore = (waterbodyScore + metroScore + hospitalScore + roadScore) / 4;

  const replacementPlot = { name, waterbodyScore, roadScore, hospitalScore, metroScore, habilScore, latitude, longitude };

  try {
    const resultPlot = await Plot.replaceOne({ _id: _id }, replacementPlot);
    res.status(200).send(resultPlot);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete plot
app.delete('/deleteplot', async (req, res) => {
  const { _id } = req.body;
  try {
    const deletedPlot = await Plot.findByIdAndDelete(_id);
    res.status(200).send(deletedPlot);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Add feature
app.post('/addfeature', async (req, res) => {
  const { name, category, latitude, longitude } = req.body;
  const newFeature = new Feature({ name, category, latitude, longitude });

  try {
    await newFeature.save();
    res.status(201).send(newFeature);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all features
app.get('/getfeature', async (req, res) => {
  try {
    const features = await Feature.find({});
    res.status(200).send(features);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get features by category
app.get('/getfeature/:category', async (req, res) => {
    const category = req.params.category;
    try {
        const features = await Feature.find({ category });
        res.json(features);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Server error');
    }
});

// Upload Excel
app.post('/uploadExcel', upload.single('file'), async (req, res) => {
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

// Upload KML
app.post('/uploadKML', upload.single('file'), async (req, res) => {
    const parser = new xml2js.Parser();
  
    try {
      const data = req.file.buffer.toString();
      parser.parseString(data, async (err, result) => {
        if (err) return res.status(500).send(err);
  
        const placemarks = result.kml.Document[0].Placemark || [];
        const dataPoints = placemarks.map(pm => {
          let coordinates, latitude, longitude;
  
          if (pm.Point) {
            coordinates = pm.Point[0].coordinates[0].trim().split(',').map(Number);
            latitude = coordinates[1];
            longitude = coordinates[0];
          } else if (pm.Polygon) {
            coordinates = pm.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0].trim().split(' ')[0].split(',').map(Number);
            latitude = coordinates[1];
            longitude = coordinates[0];
          }
  
          return {
            name: pm.name ? pm.name[0] : 'Unnamed',
            latitude,
            longitude,
            parameters: pm.ExtendedData ? pm.ExtendedData[0].Data.map(d => parseFloat(d.value[0])) : []
          };
        });
  
        const newLayer = new Layer({
          name: req.file.originalname,
          data: dataPoints.map(dp => ({
            ...dp,
            score: dp.parameters.length > 0 ? dp.parameters.reduce((a, b) => a + b) / dp.parameters.length : 0
          }))
        });
  
        await newLayer.save();
        res.status(201).send(newLayer);
      });
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
// Upload Shapefile

app.post('/uploadShapefile', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded');
      }
  
      if (req.file.mimetype !== 'application/zip') {
        return res.status(400).send('Uploaded file is not a valid ZIP file');
      }
  
      const buffer = req.file.buffer;
  
      // Log file buffer length to ensure it's read correctly
      console.log('File buffer length:', buffer.length);
  
      // Convert the buffer to a GeoJSON object using shpjs
      const geojsonArray = await shp(buffer);
      console.log('GeoJSON:', geojsonArray);
  
      let allFeatures = [];
  
      // Iterate over each FeatureCollection in the array
      geojsonArray.forEach(geojson => {
        geojson.features.forEach(feature => {
          const coordinates = turf.centroid(feature).geometry.coordinates;
          const properties = feature.properties;
  
          allFeatures.push({
            name: properties.name || 'Unnamed', // Modify according to your shapefile properties
            latitude: coordinates[1],
            longitude: coordinates[0],
            parameters: Object.values(properties).map(value => parseFloat(value)).filter(value => !isNaN(value))
          });
        });
      });
  
      console.log('All Features:', allFeatures);
  
      // Create a new layer with the extracted features
      const newLayer = new Layer({
        name: req.file.originalname,
        data: allFeatures.map(f => ({
          ...f,
          score: f.parameters.length > 0 ? f.parameters.reduce((a, b) => a + b) / f.parameters.length : 0
        }))
      });
  
      await newLayer.save();
      res.status(201).send(newLayer);
    } catch (err) {
      console.error('Error processing shapefile:', err);
      res.status(500).send(err.message);
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

// Update a specific layer by ID
app.put('/layers/:id', async (req, res) => {
  try {
    const { name, data } = req.body;
    const updatedLayer = await Layer.findByIdAndUpdate(req.params.id, { name, data }, { new: true });
    res.status(200).send(updatedLayer);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Delete a specific layer by ID
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
