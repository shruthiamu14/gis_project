// AdminPage.js

import React, { useState } from 'react';
import SideNavBar from './SideNavBar';
import AddPlotForm from './AddPlot';
import ViewPlots from './ViewPlots';
import AddFeatureForm from './AddFeature';
import UploadExcel from './UploadExcel';
import "../styles.css";

function AdminPage() {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h2>Admin Page</h2>
      </header>
      <main className="admin-main">
        <SideNavBar 
          onAddPlotClick={() => setActiveTab('add')} 
          onViewPlotsClick={() => setActiveTab('view')}
          onAddFeatureClick={() => setActiveTab('feature')}
          onUploadExcelClick={() => setActiveTab('excel')}
        />
        <section className="admin-content">
          {activeTab === 'add' && <AddPlotForm />}
          {activeTab === 'view' && <ViewPlots />}
          {activeTab === 'feature' && <AddFeatureForm />} 
          {activeTab === 'excel' && <UploadExcel />} 
        </section>
      </main>
    </div>
  );
}

export default AdminPage;