import React from 'react';

// SideNavBar.js

function SideNavBar({ onAddPlotClick, onViewPlotsClick, onAddFeatureClick }) {
  return (
    <div className='side-nav-bar'>
      <button onClick={onAddPlotClick}>Add Plot</button>
      <button onClick={onViewPlotsClick}>View Plots</button>
      <button onClick={onAddFeatureClick}>Add Feature</button> 
    </div>
  );
}

export default SideNavBar;

