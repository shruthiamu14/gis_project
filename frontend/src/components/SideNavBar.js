import React from 'react';

function SideNavBar({ onAddPlotClick, onViewPlotsClick }) {
  return (
    <div className="sidenav">
     <a href="#" className="nav-item" onClick={onAddPlotClick}>Add Plot</a>
     <a href="#" className="nav-item" onClick={onViewPlotsClick}>View Plots</a>
    </div>
  );
}

export default SideNavBar;

