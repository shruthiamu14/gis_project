import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';

const LayerControl = ({ layers, onToggle }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div style={{ position: 'absolute', top: 10, right: 10 }}>
      <Button variant="contained" onClick={handleClick}>
        Layers
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <FormGroup>
          {Object.keys(layers).map((layerName) => (
            <FormControlLabel
              control={
                <Checkbox
                  checked={layers[layerName]}
                  onChange={() => onToggle(layerName)}
                  name={layerName}
                />
              }
              label={layerName}
              key={layerName}
            />
          ))}
        </FormGroup>
      </Popover>
    </div>
  );
};

export default LayerControl;
