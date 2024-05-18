import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PlotEditForm from './PlotEditForm'; // Import the PlotEditForm component

function ViewPlots() {
  const [plots, setPlots] = useState([]);
  const [editPlot, setEditPlot] = useState(null); // Add this line

  useEffect(() => {
    const fetchPlots = async () => {
      const res = await axios.get('http://localhost:3030/getplot');
      setPlots(res.data);
    };

    fetchPlots();
  }, []);

  const handleEdit = (plot) => {
    setEditPlot(plot); // Set the plot to be edited
  };

  const handleUpdate = async (updatedPlot) => {
    // Send a request to the server to update the plot
    // ...

    // Update the plots state
    const newPlots = plots.map(plot => plot._id === updatedPlot._id ? updatedPlot : plot);
    setPlots(newPlots);

    // Clear the editPlot state
    setEditPlot(null);
  };

  const handleDelete = async (_id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this plot?');
    if (confirmDelete) {
      try {
        const response = await axios.delete('http://localhost:3030/deleteplot', { data: { _id } });
        console.log(response.data);
        // Update the plots state
        setPlots(plots.filter(plot => plot._id !== _id));
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="plots-container">
    {plots.map(plot => (
      <div className="plot-card" key={plot._id}>
        {editPlot && editPlot._id === plot._id ? (
          <PlotEditForm plot={editPlot} onUpdate={handleUpdate} /> // Render the PlotEditForm component for the plot being edited
        ) : (
            <>
          <h3>{plot.name}</h3>
          <p>Road Score: {plot.roadScore}</p>
          <p>Hospital Score: {plot.hospitalScore}</p>
          <p>Metro Score: {plot.metroScore}</p>
          <p>Waterbody Score: {plot.waterbodyScore}</p>
          <p>Habil Score: {plot.habilScore}</p>
          <p>Latitude: {plot.latitude}</p>
          <p>Longitude: {plot.longitude}</p>
          <button onClick={() => handleEdit(plot)}>Edit</button>
          <button onClick={() => handleDelete(plot._id)}>Delete</button>
          </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ViewPlots;