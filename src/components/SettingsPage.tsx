import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

interface SettingsPageProps {
  onBack: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onBack }) => {
  const [uiSize, setUiSize] = useState('small');

  const handleUpdate = () => {
    // In the future, apply UI size globally
    // For now, just log
    console.log('UI size updated:', uiSize);
    onBack();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <h2 style={{ fontSize: 18, margin: 0 }}>Settings</h2>
        <Button variant="outlined" size="small" onClick={onBack}>Back</Button>
      </Stack>
      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>UI Size</Typography>
      <Select
        value={uiSize}
        onChange={e => setUiSize(e.target.value)}
        size="small"
        sx={{ width: 180 }}
      >
        <MenuItem value="small">Small</MenuItem>
        <MenuItem value="medium">Medium</MenuItem>
        <MenuItem value="large">Large</MenuItem>
      </Select>
      <Typography variant="body2" sx={{ mt: 2, color: '#888' }}>
        (This will control the font and component size throughout the app in the future.)
      </Typography>
      <Button variant="contained" sx={{ mt: 3 }} onClick={handleUpdate}>Update</Button>
    </Box>
  );
};

export default SettingsPage; 