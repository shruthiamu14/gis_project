// AddFeatureForm.js

import React, { useState } from 'react';
import axios from 'axios';

function AddFeatureForm() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post('https://gis-project.onrender.com/addfeature', {name, category, latitude, longitude} )
        console.log(res.data);
        // Reset form fields
        setName('');
        setCategory('');
        setLatitude('');
        setLongitude('');
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className='add-feature-form'>
      <h3>Add Feature</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="featureName">Feature Name:</label>
          <input type="text" id="featureName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Select a category</option>
            <option value="category1">Road</option>
            <option value="category2">water body</option>
            <option value="category2">hospital</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitude:</label>
          <input type="text" id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude:</label>
          <input type="text" id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <button type="submit">Add Feature</button>
      </form>
    </div>
  );
}

export default AddFeatureForm;