// AdminPage.js

import React, { useState } from 'react';
import SideNavBar from './SideNavBar';
import AddPlotForm from './AddPlot';
import ViewPlots from './ViewPlots'; // New component
import AddFeatureForm from './AddFeature'; // Import the new component

function AdminPage() {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className='admin-container'>
      <h2>Admin Page</h2>
      <SideNavBar 
        onAddPlotClick={() => setActiveTab('add')} 
        onViewPlotsClick={() => setActiveTab('view')}
        onAddFeatureClick={() => setActiveTab('feature')} // New prop
      />
      {activeTab === 'add' && <AddPlotForm />}
      {activeTab === 'view' && <ViewPlots />}
      {activeTab === 'feature' && <AddFeatureForm />} 
    </div>
  );
}

export default AdminPage;