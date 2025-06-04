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
  <AppBar position="static" elevation={0} sx={{ zIndex: 1201, bgcolor: '#23262F', color: '#F3F4F6', boxShadow: 'none' }}>
    <Toolbar sx={{ bgcolor: '#23262F', color: '#F3F4F6' }}>
      <Button onClick={onHome} startIcon={<HomeIcon />} size="small" sx={{ mr: 2, color: '#F3F4F6', borderColor: '#23262F', background: '#181A1B', textTransform: 'none', borderRadius: 2, fontWeight: 500, fontSize: 15, boxShadow: 'none', '&:hover': { background: '#232946', borderColor: '#F3F4F6', color: '#fff' } }} variant="outlined">
        Home
      </Button>
      <Typography variant="h6" color="#F3F4F6" component="div" sx={{ flexGrow: 1 }}>
        Dashboard
      </Typography>
      {/* Add import/export/print buttons here later */}
    </Toolbar>
  </AppBar>
);

export default TopBar; 