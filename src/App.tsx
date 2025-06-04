import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import CanvasArea from './components/CanvasArea';
import PropertiesPanel from './components/PropertiesPanel';
import SettingsPage from './components/SettingsPage';
import LayerPanel from './components/LayerPanel';

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

function App() {
  const [showSettings, setShowSettings] = useState(false);
  const [elements, setElements] = useState(initialElements);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Label size/orientation state (for properties panel)
  const [labelSize, setLabelSize] = useState({ width: 400, height: 200, orientation: 'landscape' });

  const handleHome = () => {
    setShowSettings(false);
    setSelectedId(null);
  };

  return (
    <Box sx={{ display: 'flex', position: 'fixed', inset: 0, height: '100vh', width: '100vw', bgcolor: '#f5f6fa', overflow: 'hidden' }}>
      <CssBaseline />
      <Sidebar width={drawerWidth} onSettingsClick={() => setShowSettings(true)} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {showSettings ? (
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
        )}
      </Box>
    </Box>
  );
}

export default App;
