// AddPlotForm.js

import React, { useState } from 'react';
import axios from 'axios';

function AddPlotForm() {
  const [name, setName] = useState('');
  const [roadScore, setRoadScore] = useState('');
  const [hospitalScore, setHospitalScore] = useState('');
  const [metroScore, setMetroScore] = useState('');
  const [waterbodyScore, setWaterbodyScore] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [successMessage, setSuccessMessage] = useState('');


  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
        const res = await axios.post('http://localhost:3030/addplot', {name, roadScore, hospitalScore, metroScore, waterbodyScore,latitude, longitude} )
        console.log(res.data);
        setSuccessMessage('Your data is successfully saved'); // Set success message
        // Reset form fields
        setName('');
        setRoadScore('');
        setHospitalScore('');
        setMetroScore('');
        setWaterbodyScore('');
        setLatitude('');
        setLongitude('');
        setTimeout(() => {
          setSuccessMessage(''); // Clear success message after 3 seconds
        }, 3000);
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <div className='add-plot-form'>
    <div>
      <h3>Add Plot</h3>
      {successMessage && <div className="success-message">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="plotName">Plot Name:</label>
          <input type="text" id="plotName" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="roadScore">Road Score:</label>
          <input type="number" id="roadScore" value={roadScore} onChange={(e) => setRoadScore(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="hospitalScore">Hospital Score:</label>
          <input type="number" id="hospitalScore" value={hospitalScore} onChange={(e) => setHospitalScore(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="metroScore">Metro Score:</label>
          <input type="number" id="metroScore" value={metroScore} onChange={(e) => setMetroScore(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="waterbodyScore">Waterbody Score:</label>
          <input type="number" id="waterbodyScore" value={waterbodyScore} onChange={(e) => setWaterbodyScore(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="latitude">latitude:</label>
          <input type="number" id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">longitude:</label>
          <input type="number" id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
}

export default AddPlotForm;
