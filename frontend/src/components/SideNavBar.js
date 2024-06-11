import React from 'react';
import "../styles.css";

// SideNavBar.js

function SideNavBar({ onAddPlotClick, onViewPlotsClick, onAddFeatureClick, onUploadExcelClick }) {
  return (
    <div className='side-nav-bar'>
      <button onClick={onAddPlotClick}>Add Plot</button>
      <button onClick={onViewPlotsClick}>View Plots</button>
      <button onClick={onAddFeatureClick}>Add Feature</button> 
      <button onClick={onUploadExcelClick}>Upload Excel</button> 

    </div>
  );
}

export default SideNavBar;

