import React, { useState } from 'react';
import '../PlotEditForm.css'; // Import the CSS file

function PlotEditForm({ plot, onUpdate }) {
  const [name, setName] = useState(plot.name);
  const [roadScore, setRoadScore] = useState(plot.roadScore);
  const [hospitalScore, setHospitalScore] = useState(plot.hospitalScore);
  const [metroScore, setMetroScore] = useState(plot.metroScore);
  const [waterbodyScore, setWaterbodyScore] = useState(plot.waterbodyScore);
  const [latitude, setLatitude] = useState(plot.latitude);
  const [longitude, setLongitude] = useState(plot.longitude);

  const handleSubmit = (event) => {
    event.preventDefault();
    const updatedPlot = {
      _id: plot._id,
      name,
      roadScore,
      hospitalScore,
      metroScore,
      waterbodyScore,
      habilScore: (roadScore + hospitalScore + metroScore + waterbodyScore) / 4,
      latitude,
      longitude
    };
    onUpdate(updatedPlot);
  };

  return (
    <form className="plot-edit-form" onSubmit={handleSubmit}>
  <label>
    Name:
    <input type="text" value={name} onChange={e => setName(e.target.value)} />
  </label>
  <label>
    Road Score:
    <input type="number" value={roadScore} onChange={e => setRoadScore(e.target.value)} />
  </label>
  <label>
    Hospital Score:
    <input type="number" value={hospitalScore} onChange={e => setHospitalScore(e.target.value)} />
  </label>
  <label>
    Metro Score:
    <input type="number" value={metroScore} onChange={e => setMetroScore(e.target.value)} />
  </label>
  <label>
    Waterbody Score:
    <input type="number" value={waterbodyScore} onChange={e => setWaterbodyScore(e.target.value)} />
  </label>
  <label>
    Latitude:
    <input type="number" value={latitude} onChange={e => setLatitude(e.target.value)} />
  </label>
  <label>
    Longitude:
    <input type="number" value={longitude} onChange={e => setLongitude(e.target.value)} />
  </label>
  <button type="submit">Update</button>
</form>
  );
}

export default PlotEditForm;