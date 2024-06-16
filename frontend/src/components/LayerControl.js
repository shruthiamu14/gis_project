import React, { useState } from 'react';
import { Button, Checkbox, Menu, MenuItem } from '@mui/material';

const LayerControl = ({ layers, onToggleLayer }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedLayers, setSelectedLayers] = useState(Object.keys(layers));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (layerName) => {
    const updatedLayers = selectedLayers.includes(layerName)
      ? selectedLayers.filter((name) => name !== layerName)
      : [...selectedLayers, layerName];
    
    setSelectedLayers(updatedLayers);
    onToggleLayer(layerName, updatedLayers.includes(layerName));
  };

  return (
    <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
      <Button variant="contained" color="primary" onClick={handleClick}>
        Layers
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {Object.keys(layers).map((layerName) => (
          <MenuItem key={layerName} onClick={() => handleToggle(layerName)}>
            <Checkbox checked={selectedLayers.includes(layerName)} />
            {layerName}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default LayerControl;
