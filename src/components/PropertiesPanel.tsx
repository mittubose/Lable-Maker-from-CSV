import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CropLandscapeIcon from '@mui/icons-material/CropLandscape';
import CropPortraitIcon from '@mui/icons-material/CropPortrait';

interface PropertiesPanelProps {
  elements: any[];
  setElements: (els: any[]) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  labelSize: { width: number; height: number; orientation: string; unit: string };
  setLabelSize: (size: { width: number; height: number; orientation: string; unit: string }) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ elements, setElements, selectedId, setSelectedId, labelSize, setLabelSize }) => {
  const el = elements.find(e => e.id === selectedId);

  const handleChange = (key: string, value: any) => {
    setElements(elements.map(e => e.id === selectedId ? { ...e, [key]: value } : e));
  };

  const handleDelete = () => {
    setElements(elements.filter(e => e.id !== selectedId));
    setSelectedId(null);
  };

  const handleLabelSizeChange = (key: string, value: any) => {
    if (key === 'orientation' && value !== labelSize.orientation) {
      setLabelSize({
        ...labelSize,
        orientation: value,
        width: labelSize.height,
        height: labelSize.width,
      });
    } else {
      setLabelSize({ ...labelSize, [key]: value });
    }
  };

  return (
    <Box sx={{ width: 300, bgcolor: '#23262F', borderLeft: '1px solid #23262F', p: 2, height: '100%' }}>
      <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, letterSpacing: 0.2, color: '#F3F4F6' }}>Properties</h3>
      <Stack spacing={1.2}>
        <Box>
          <b style={{ fontSize: 13 }}>Label Size & Orientation</b>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
            <TextField
              label="Width"
              type="number"
              value={labelSize.width}
              onChange={e => handleLabelSizeChange('width', Number(e.target.value))}
              size="small"
              sx={{ width: 70, fontSize: 12 }}
              InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
              InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
            />
            <TextField
              label="Height"
              type="number"
              value={labelSize.height}
              onChange={e => handleLabelSizeChange('height', Number(e.target.value))}
              size="small"
              sx={{ width: 70, fontSize: 12 }}
              InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
              InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
            />
            <Select
              label="Unit"
              value={labelSize.unit || 'px'}
              onChange={e => handleLabelSizeChange('unit', e.target.value)}
              size="small"
              sx={{ width: 70, fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' }}
              inputProps={{ style: { fontSize: 12, color: '#F3F4F6' } }}
            >
              <MenuItem value="px" sx={{ fontSize: 12, color: '#F3F4F6' }}>px</MenuItem>
              <MenuItem value="cm" sx={{ fontSize: 12, color: '#F3F4F6' }}>cm</MenuItem>
              <MenuItem value="in" sx={{ fontSize: 12, color: '#F3F4F6' }}>in</MenuItem>
              <MenuItem value="ratio" sx={{ fontSize: 12, color: '#F3F4F6' }}>ratio</MenuItem>
            </Select>
            <Tooltip title="Landscape">
              <IconButton color={labelSize.orientation === 'landscape' ? 'primary' : 'default'} onClick={() => handleLabelSizeChange('orientation', 'landscape')} size="small">
                <CropLandscapeIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Portrait">
              <IconButton color={labelSize.orientation === 'portrait' ? 'primary' : 'default'} onClick={() => handleLabelSizeChange('orientation', 'portrait')} size="small">
                <CropPortraitIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
        {!el && (
          <p style={{ color: '#888', fontSize: 12 }}>Select an element to edit its properties.</p>
        )}
        {el && (
          <>
            <div style={{ fontSize: 12 }}>
              <b>Type:</b> {el.type.charAt(0).toUpperCase() + el.type.slice(1)}
            </div>
            {el.type === 'text' && (
              <>
                <TextField
                  label="Text"
                  value={el.text}
                  onChange={e => handleChange('text', e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
                <TextField
                  label="Font Size"
                  type="number"
                  value={el.fontSize}
                  onChange={e => handleChange('fontSize', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
                <TextField
                  label="Color"
                  type="color"
                  value={el.fill}
                  onChange={e => handleChange('fill', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true, style: { fontSize: 11, color: '#aaa' } }}
                  sx={{ fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                />
              </>
            )}
            {el.type === 'rect' && (
              <>
                <TextField
                  label="Width"
                  type="number"
                  value={el.width}
                  onChange={e => handleChange('width', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
                <TextField
                  label="Height"
                  type="number"
                  value={el.height}
                  onChange={e => handleChange('height', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
                <TextField
                  label="Fill Color"
                  type="color"
                  value={el.fill}
                  onChange={e => handleChange('fill', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true, style: { fontSize: 11, color: '#aaa' } }}
                  sx={{ fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                />
                <TextField
                  label="Stroke Color"
                  type="color"
                  value={el.stroke}
                  onChange={e => handleChange('stroke', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true, style: { fontSize: 11, color: '#aaa' } }}
                  sx={{ fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                />
              </>
            )}
            {el.type === 'qr' && (
              <>
                <TextField
                  label="Data"
                  value={el.data}
                  onChange={e => handleChange('data', e.target.value)}
                  fullWidth
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
                <TextField
                  label="Size"
                  type="number"
                  value={el.size}
                  onChange={e => handleChange('size', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
              </>
            )}
            {el.type === 'image' && (
              <>
                <TextField
                  label="Width"
                  type="number"
                  value={el.width}
                  onChange={e => handleChange('width', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
                <TextField
                  label="Height"
                  type="number"
                  value={el.height}
                  onChange={e => handleChange('height', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12, background: '#181A1B', color: '#F3F4F6', borderRadius: 6, border: '1px solid #23262F' } }}
                  InputLabelProps={{ style: { fontSize: 11, color: '#aaa' } }}
                />
                {/* Image upload coming soon */}
              </>
            )}
            <Button color="error" variant="outlined" onClick={handleDelete} sx={{ fontSize: 12, py: 0.5 }}>
              Delete
            </Button>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default PropertiesPanel; 