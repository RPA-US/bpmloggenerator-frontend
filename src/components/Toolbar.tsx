import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const ToolbarComponent: React.FC = ({ children }) => (
  <AppBar position="static">
    <Toolbar>
      { children }
    </Toolbar>
  </AppBar>
)

export default ToolbarComponent;