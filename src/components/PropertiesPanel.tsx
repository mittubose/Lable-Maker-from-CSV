import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface PropertiesPanelProps {
  elements: any[];
  setElements: (els: any[]) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  labelSize: { width: number; height: number; orientation: string };
  setLabelSize: (size: { width: number; height: number; orientation: string }) => void;
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
    setLabelSize({ ...labelSize, [key]: value });
  };

  if (!el) {
    return (
      <Box sx={{ width: 300, bgcolor: '#f8fafc', borderLeft: '1px solid #e0e0e0', p: 2, height: '100%' }}>
        <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, letterSpacing: 0.2 }}>Properties</h3>
        <p style={{ color: '#888', fontSize: 12 }}>Select an element to edit its properties.</p>
      </Box>
    );
  }

  return (
    <Box sx={{ width: 300, bgcolor: '#f8fafc', borderLeft: '1px solid #e0e0e0', p: 2, height: '100%' }}>
      <h3 style={{ marginTop: 0, fontSize: 15, fontWeight: 600, letterSpacing: 0.2 }}>Properties</h3>
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
              InputProps={{ style: { fontSize: 12 } }}
              InputLabelProps={{ style: { fontSize: 11 } }}
            />
            <TextField
              label="Height"
              type="number"
              value={labelSize.height}
              onChange={e => handleLabelSizeChange('height', Number(e.target.value))}
              size="small"
              sx={{ width: 70, fontSize: 12 }}
              InputProps={{ style: { fontSize: 12 } }}
              InputLabelProps={{ style: { fontSize: 11 } }}
            />
            <Select
              label="Orientation"
              value={labelSize.orientation}
              onChange={e => handleLabelSizeChange('orientation', e.target.value)}
              size="small"
              sx={{ width: 100, fontSize: 12 }}
              inputProps={{ style: { fontSize: 12 } }}
            >
              <MenuItem value="landscape" sx={{ fontSize: 12 }}>Landscape</MenuItem>
              <MenuItem value="portrait" sx={{ fontSize: 12 }}>Portrait</MenuItem>
            </Select>
          </Stack>
        </Box>
        {el ? (
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
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
                />
                <TextField
                  label="Font Size"
                  type="number"
                  value={el.fontSize}
                  onChange={e => handleChange('fontSize', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
                />
                <TextField
                  label="Color"
                  type="color"
                  value={el.fill}
                  onChange={e => handleChange('fill', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true, style: { fontSize: 11 } }}
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12 } }}
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
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
                />
                <TextField
                  label="Height"
                  type="number"
                  value={el.height}
                  onChange={e => handleChange('height', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
                />
                <TextField
                  label="Fill Color"
                  type="color"
                  value={el.fill}
                  onChange={e => handleChange('fill', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true, style: { fontSize: 11 } }}
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12 } }}
                />
                <TextField
                  label="Stroke Color"
                  type="color"
                  value={el.stroke}
                  onChange={e => handleChange('stroke', e.target.value)}
                  size="small"
                  InputLabelProps={{ shrink: true, style: { fontSize: 11 } }}
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12 } }}
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
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
                />
                <TextField
                  label="Size"
                  type="number"
                  value={el.size}
                  onChange={e => handleChange('size', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
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
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
                />
                <TextField
                  label="Height"
                  type="number"
                  value={el.height}
                  onChange={e => handleChange('height', Number(e.target.value))}
                  size="small"
                  sx={{ fontSize: 12 }}
                  InputProps={{ style: { fontSize: 12 } }}
                  InputLabelProps={{ style: { fontSize: 11 } }}
                />
                {/* Image upload coming soon */}
              </>
            )}
            <Button color="error" variant="outlined" onClick={handleDelete} sx={{ fontSize: 12, py: 0.5 }}>
              Delete
            </Button>
          </>
        ) : (
          <p style={{ color: '#888', fontSize: 12 }}>Select an element to edit its properties.</p>
        )}
      </Stack>
    </Box>
  );
};

export default PropertiesPanel; 