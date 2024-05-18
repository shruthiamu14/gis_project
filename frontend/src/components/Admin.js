// AdminPage.js

import React, { useState } from 'react';
import SideNavBar from './SideNavBar';
import AddPlotForm from './AddPlot';
import ViewPlots from './ViewPlots'; // New component

function AdminPage() {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className='admin-container'>
      <h2>Admin Page</h2>
      <SideNavBar 
        onAddPlotClick={() => setActiveTab('add')} 
        onViewPlotsClick={() => setActiveTab('view')} // New prop
      />
      {activeTab === 'add' && <AddPlotForm />}
      {activeTab === 'view' && <ViewPlots />} 
    </div>
  );
}

export default AdminPage;