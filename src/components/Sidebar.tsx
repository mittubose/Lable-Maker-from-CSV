import React from 'react';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SettingsIcon from '@mui/icons-material/Settings';

interface SidebarProps {
  width: number;
  onSettingsClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ width, onSettingsClick }) => (
  <Drawer
    variant="permanent"
    sx={{
      width,
      flexShrink: 0,
      [`& .MuiDrawer-paper`]: { width, boxSizing: 'border-box', bgcolor: '#232946', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    }}
    PaperProps={{ elevation: 2 }}
  >
    <Box sx={{ p: 2 }}>
      <h2 style={{ margin: 0, fontSize: 20 }}>Label Maker</h2>
      {/* Add nav/tools here later */}
    </Box>
    <List sx={{ mb: 1 }}>
      <ListItem disablePadding>
        <ListItemButton onClick={onSettingsClick}>
          <ListItemIcon sx={{ color: '#fff' }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItemButton>
      </ListItem>
    </List>
  </Drawer>
);

export default Sidebar; 