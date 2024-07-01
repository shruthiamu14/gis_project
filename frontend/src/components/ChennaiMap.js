import React, { useState, useEffect } from 'react';
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Icon, divIcon, point } from "leaflet";
import axios from "axios";
import { useMap } from 'react-leaflet';
import Navbar from "./NavBar";
import LayerControl from './LayerControl';
import UploadForm from './UploadForm';

// create custom icon
const customIcon = new Icon({
  iconUrl: require("../icons/placeholder.png"),
  iconSize: [38, 38] // size of the icon
});

// custom cluster icon
const createClusterCustomIcon = function (cluster) {
  return new divIcon({
    html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
    className: "custom-marker-cluster",
    iconSize: point(33, 33, true)
  });
};

export default function ChennaiMap() {
  const [pincode, setPincode] = useState("");
  const [searchedMarker, setSearchedMarker] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.8566, 80.3522]);
  const [plots, setPlots] = useState([]);
  const [features, setFeatures] = useState([]);
  const [layers, setLayers] = useState({
    Plots: true,
    Features: true,
    ExcelSheets: true
  });
  const [excelData, setExcelData] = useState([]);

  useEffect(() => {
    // Fetch plots from backend
    const fetchPlots = async () => {
      try {
        const response = await axios.get('https://gis-project.onrender.com/getplot');
        setPlots(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPlots();
  }, []);

  useEffect(() => {
    // Fetch features from backend
    const fetchFeatures = async () => {
      try {
        const response = await axios.get('https://gis-project.onrender.com/getfeature');
        setFeatures(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFeatures();
  }, []);

  useEffect(() => {
    // Fetch Excel data from backend
    const fetchExcelData = async () => {
      try {
        const response = await axios.get('https://gis-project.onrender.com/layers');
        setExcelData(response.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchExcelData();
  }, []);

  const handleLayerToggle = (layerName) => {
    setLayers(prevLayers => ({
      ...prevLayers,
      [layerName]: !prevLayers[layerName]
    }));
  };

  const handleFileUpload = (newLayer) => {
    setExcelData(prevData => [...prevData, newLayer]);
  };

  const handleSearch = async (pincode) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${process.env.REACT_APP_OPENCAGE_API_KEY}`;

    try {
      const response = await axios.get(url);
      const data = response.data;

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setSearchedMarker([lat, lng]);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
  };

  return (
    <div id="app-container">
      <Navbar />
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter Pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
        />
        <button onClick={() => handleSearch(pincode)}>Search</button>
      </div>
      {/* <UploadForm onUpload={handleFileUpload} /> */}
      <MapContainer className="leaflet-container" center={mapCenter} zoom={13}>
        <ChangeView center={mapCenter} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LayerControl layers={layers} onToggle={handleLayerToggle} />
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
        >
          {layers.Plots && plots.map((plot) => (
            <Marker key={plot._id} position={[plot.latitude, plot.longitude]} icon={customIcon}>
              <Popup>{"Name :" + plot.name} <br /> {"HabilScore :" + plot.habilScore}</Popup>
            </Marker>
          ))}
          {layers.Features && features.map((feature) => (
            <Marker key={feature._id} position={[feature.latitude, feature.longitude]} icon={customIcon}>
              <Popup>{"Name :" + feature.name} <br /> {"category :" + feature.category}</Popup>
            </Marker>
          ))}
          {layers.ExcelSheets && excelData.map((layer) => (
            layer.data.map((point, index) => (
              <Marker key={`${layer.name}-${index}`} position={[point.latitude, point.longitude]} icon={customIcon}>
                <Popup>{"Name :" + point.name} <br /> {"Score :" + point.score}</Popup>
              </Marker>
            ))
          ))}
          {searchedMarker && (
            <Marker position={searchedMarker} icon={customIcon}>
              <Popup>Pincode Location</Popup>
            </Marker>
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}
