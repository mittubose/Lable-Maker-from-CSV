import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CanvasArea from './components/CanvasArea';
import PropertiesPanel from './components/PropertiesPanel';
import SettingsPage from './components/SettingsPage';
import LayerPanel from './components/LayerPanel';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

const drawerWidth = 220;
const propertiesWidth = 300;

const initialElements = [
  {
    id: 'text-1',
    type: 'text',
    x: 120,
    y: 80,
    text: 'Drag me!',
    fontSize: 28,
    fontStyle: 'bold',
    fill: '#232946',
  },
  {
    id: 'rect-1',
    type: 'rect',
    x: 60,
    y: 30,
    width: 80,
    height: 40,
    fill: '#ffb800',
    stroke: '#232946',
    strokeWidth: 2,
  },
  {
    id: 'qr-1',
    type: 'qr',
    x: 300,
    y: 120,
    size: 60,
    data: 'https://example.com',
  },
  {
    id: 'img-1',
    type: 'image',
    x: 250,
    y: 40,
    width: 60,
    height: 60,
    src: '', // Placeholder, no image yet
  },
];

function CsvPreviewPage({ file, onUseCsv }: { file: File | null, onUseCsv: () => void }) {
  const [fields, setFields] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  React.useEffect(() => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      setFields(lines[0].split(','));
      setRows(lines.slice(1, 4).map(line => line.split(',')));
    };
    reader.readAsText(file);
  }, [file]);
  if (!file) return <Box sx={{ color: '#F3F4F6', p: 4 }}>No CSV uploaded.</Box>;
  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: '#181A1B', color: '#F3F4F6' }}>
      <Box sx={{ flex: 1, p: 4, minWidth: 0 }}>
        <h2>CSV Preview</h2>
        <div style={{ marginBottom: 16 }}>Fields: {fields.join(', ')}</div>
        <Button variant="contained" color="primary" onClick={onUseCsv} disabled={!fields.length}>Use These Fields</Button>
      </Box>
      <Box sx={{ flex: 1.2, p: 4, minWidth: 0, bgcolor: '#23262F', borderLeft: '1px solid #232946', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <h3 style={{ color: '#F3F4F6', margin: 0, marginBottom: 16 }}>Label Preview</h3>
        {rows.length === 0 && <div style={{ color: '#888' }}>No data rows in CSV.</div>}
        {rows.map((row, i) => (
          <Box key={i} sx={{ bgcolor: '#fff', color: '#232946', borderRadius: 2, p: 2, mb: 2, boxShadow: 2, minWidth: 0 }}>
            {fields.map((field, j) => (
              <div key={j} style={{ fontSize: 14, marginBottom: 2 }}>
                <b>{field.trim()}:</b> {row[j] ?? ''}
              </div>
            ))}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [elements, setElements] = useState(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [labelSize, setLabelSize] = useState({ width: 400, height: 200, orientation: 'landscape', unit: 'px' });
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const navigate = useNavigate();

  const handleHome = () => {
    setShowSettings(false);
    setSelectedId(null);
  };

  const handleCsvUpload = (file: File) => {
    setCsvFile(file);
    navigate('/csv-preview');
  };

  const handleUseCsv = () => {
    // TODO: Use the CSV fields for something
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', position: 'fixed', inset: 0, height: '100vh', width: '100vw', bgcolor: '#181A1B', overflow: 'hidden' }}>
      <CssBaseline />
      <Sidebar width={drawerWidth} onSettingsClick={() => setShowSettings(true)} onCsvUpload={handleCsvUpload} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Routes>
          <Route path="/csv-preview" element={<CsvPreviewPage file={csvFile} onUseCsv={handleUseCsv} />} />
          <Route path="/" element={
            showSettings ? (
              <SettingsPage onBack={() => setShowSettings(false)} />
            ) : (
              <>
                <TopBar onHome={handleHome} />
                <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minWidth: 0 }}>
                  <CanvasArea
                    elements={elements}
                    setElements={setElements}
                    selectedId={selectedId}
                    setSelectedId={setSelectedId}
                    labelSize={labelSize}
                  />
                  <Box sx={{ width: propertiesWidth, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <PropertiesPanel
                      elements={elements}
                      setElements={setElements}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                      labelSize={labelSize}
                      setLabelSize={setLabelSize}
                    />
                    <LayerPanel
                      elements={elements}
                      setElements={setElements}
                      selectedId={selectedId}
                      setSelectedId={setSelectedId}
                    />
                  </Box>
                </Box>
              </>
            )
          } />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
