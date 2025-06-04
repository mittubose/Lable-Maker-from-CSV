import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';
import HomeIcon from '@mui/icons-material/Home';
import TableViewIcon from '@mui/icons-material/TableView';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  width: number;
  onSettingsClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ width, onSettingsClick }) => {
  const navigate = useNavigate();
  const handleHome = () => navigate('/');
  const handleManageCsv = () => navigate('/csvs');
  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width,
          boxSizing: 'border-box',
          bgcolor: '#181A1B',
          color: '#F3F4F6',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #23262F',
          boxShadow: '2px 0 8px 0 #0002',
        },
      }}
      PaperProps={{ elevation: 0 }}
    >
      <Box sx={{ p: 2 }}>
        <h2 style={{ margin: 0, fontSize: 20, color: '#F3F4F6', fontWeight: 700, letterSpacing: 0.5 }}>CSV to Label</h2>
        <List sx={{ mt: 2, mb: 1 }}>
          <ListItem disablePadding>
            <ListItemButton onClick={handleHome} sx={{ borderRadius: 2, mx: 1, my: 0.5, color: '#F3F4F6', '&:hover': { bgcolor: '#23262F' } }}>
              <ListItemIcon sx={{ color: '#F3F4F6' }}>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Home" primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }} />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleManageCsv} sx={{ borderRadius: 2, mx: 1, my: 0.5, color: '#F3F4F6', '&:hover': { bgcolor: '#23262F' } }}>
              <ListItemIcon sx={{ color: '#F3F4F6' }}>
                <TableViewIcon />
              </ListItemIcon>
              <ListItemText primary="Manage CSV" primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }} />
            </ListItemButton>
          </ListItem>
        </List>
        <Box sx={{ borderBottom: '1px solid #23262F', my: 2 }} />
      </Box>
      <List sx={{ mb: 1 }}>
        <ListItem disablePadding>
          <ListItemButton onClick={onSettingsClick} sx={{ borderRadius: 2, mx: 1, my: 0.5, color: '#F3F4F6', '&:hover': { bgcolor: '#23262F' } }}>
            <ListItemIcon sx={{ color: '#F3F4F6' }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500, fontSize: 15 }} />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar; 