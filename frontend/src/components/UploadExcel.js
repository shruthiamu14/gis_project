import React, { useState } from 'react';
import axios from 'axios';

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [layerName, setLayerName] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLayerNameChange = (e) => {
    setLayerName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('layerName', layerName);

    try {
      const response = await axios.post('https://gis-project.onrender.com/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Layer uploaded successfully:', response.data);
    } catch (err) {
      console.error('Error uploading layer:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Layer Name" value={layerName} onChange={handleLayerNameChange} />
      <input type="file" onChange={handleFileChange} />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadExcel;