import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeIcon from '@mui/icons-material/Home';

interface TopBarProps {
  onHome: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onHome }) => (
  <AppBar position="static" color="default" elevation={1} sx={{ zIndex: 1201 }}>
    <Toolbar>
      <Button onClick={onHome} startIcon={<HomeIcon />} size="small" sx={{ mr: 2 }} variant="outlined">
        Home
      </Button>
      <Typography variant="h6" color="inherit" component="div" sx={{ flexGrow: 1 }}>
        Modern Label Maker
      </Typography>
      {/* Add import/export/print buttons here later */}
    </Toolbar>
  </AppBar>
);

export default TopBar; 