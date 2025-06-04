import React from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ImageIcon from '@mui/icons-material/Image';

function getIcon(type: string) {
  switch (type) {
    case 'text': return <TextFieldsIcon fontSize="small" />;
    case 'rect': return <CropSquareIcon fontSize="small" />;
    case 'qr': return <QrCodeIcon fontSize="small" />;
    case 'image': return <ImageIcon fontSize="small" />;
    default: return null;
  }
}

interface LayerPanelProps {
  elements: any[];
  setElements: (els: any[]) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const LayerPanel: React.FC<LayerPanelProps> = ({ elements, setElements, selectedId, setSelectedId }) => {
  const move = (from: number, to: number) => {
    if (to < 0 || to >= elements.length) return;
    const arr = [...elements];
    const [item] = arr.splice(from, 1);
    arr.splice(to, 0, item);
    setElements(arr);
  };

  const toggleProp = (id: string, prop: string) => {
    setElements(elements.map(e => e.id === id ? { ...e, [prop]: !e[prop] } : e));
  };

  const handleDelete = (id: string) => {
    setElements(elements.filter(e => e.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  return (
    <Box sx={{ width: 1, bgcolor: '#f4f4f8', borderTop: '1px solid #e0e0e0', p: 0, m: 0, height: '100%', minHeight: 0 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5, fontSize: 13, px: 1, pt: 1 }}>Layers</Typography>
      <List dense sx={{ p: 0, m: 0 }}>
        {elements.map((el, idx) => (
          <ListItem
            key={el.id}
            disablePadding
            secondaryAction={
              <>
                <IconButton size="small" onClick={() => move(idx, idx - 1)} title="Move up"><ArrowUpwardIcon fontSize="inherit" /></IconButton>
                <IconButton size="small" onClick={() => move(idx, idx + 1)} title="Move down"><ArrowDownwardIcon fontSize="inherit" /></IconButton>
                <IconButton size="small" onClick={() => toggleProp(el.id, 'hidden')} title={el.hidden ? 'Show' : 'Hide'}>
                  {el.hidden ? <VisibilityOffIcon fontSize="inherit" /> : <VisibilityIcon fontSize="inherit" />}
                </IconButton>
                <IconButton size="small" onClick={() => toggleProp(el.id, 'locked')} title={el.locked ? 'Unlock' : 'Lock'}>
                  {el.locked ? <LockIcon fontSize="inherit" /> : <LockOpenIcon fontSize="inherit" />}
                </IconButton>
                <IconButton size="small" color="error" onClick={() => handleDelete(el.id)} title="Delete"><DeleteIcon fontSize="inherit" /></IconButton>
              </>
            }
            sx={{ bgcolor: selectedId === el.id ? '#e3e8ff' : undefined, borderRadius: 1, mb: 0.25, minHeight: 32 }}
          >
            <ListItemButton selected={selectedId === el.id} onClick={() => setSelectedId(el.id)} sx={{ minHeight: 32, px: 1 }}>
              <ListItemIcon sx={{ minWidth: 28 }}>{getIcon(el.type)}</ListItemIcon>
              <ListItemText
                primary={el.type.charAt(0).toUpperCase() + el.type.slice(1)}
                secondary={el.type === 'text' ? el.text : el.type === 'qr' ? el.data : undefined}
                primaryTypographyProps={{ fontSize: 13, lineHeight: 1.2 }}
                secondaryTypographyProps={{ fontSize: 11, color: '#666', lineHeight: 1.1 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default LayerPanel; 