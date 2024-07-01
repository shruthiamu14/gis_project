import React, { useState } from 'react';
import axios from 'axios';

const UploadForm = ({ onUpload }) => {
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState('excel'); // Default to excel

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileTypeChange = (event) => {
    setFileType(event.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      let url = '';
      switch (fileType) {
        case 'kml':
          url = 'https://gis-project.onrender.com/uploadKML';
          break;
        case 'shapefile':
          url = 'https://gis-project.onrender.com/uploadShapefile';
          break;
        default:
          url = 'https://gis-project.onrender.com/uploadExcel';
      }

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      onUpload(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <select value={fileType} onChange={handleFileTypeChange}>
        <option value="excel">Excel</option>
        <option value="kml">KML</option>
        <option value="shapefile">Shapefile</option>
      </select>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadForm;
