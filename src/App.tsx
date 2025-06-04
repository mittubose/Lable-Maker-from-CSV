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
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Check';
import CancelIcon from '@mui/icons-material/Close';
import Slider from '@mui/material/Slider';
import TextField from '@mui/material/TextField';

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

const UNIT_FACTORS: Record<string, number> = {
  px: 1,
  in: 96,
  cm: 37.8,
  mm: 3.78,
};

const CSV_STORAGE_KEY = 'uploaded_csvs_v1';
type CsvFile = { id: number; name: string; content: string; timestamp: string };
function getSavedCSVs(): CsvFile[] {
  try {
    return JSON.parse(localStorage.getItem(CSV_STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}
function saveCSVs(arr: CsvFile[]): void {
  localStorage.setItem(CSV_STORAGE_KEY, JSON.stringify(arr));
}

function saveCsvToStorage({ name, content }: { name: string; content: string }): void {
  const arr = getSavedCSVs();
  const now = new Date().toISOString();
  arr.push({ id: Date.now() + Math.random(), name, content, timestamp: now });
  saveCSVs(arr);
}
function updateCsvInStorage(id: number, update: Partial<CsvFile>): void {
  const arr = getSavedCSVs();
  const idx = arr.findIndex((f: CsvFile) => f.id === id);
  if (idx !== -1) {
    arr[idx] = { ...arr[idx], ...update };
    saveCSVs(arr);
  }
}
function deleteCsvFromStorage(id: number): void {
  const arr = getSavedCSVs().filter((f: CsvFile) => f.id !== id);
  saveCSVs(arr);
}

function CsvManagementPage({ onView, onUpload }: { onView: (csv: CsvFile) => void, onUpload: (file: File) => void }) {
  const [csvs, setCsvs] = React.useState<CsvFile[]>(getSavedCSVs());
  const [editingId, setEditingId] = React.useState<number | null>(null);
  const [editName, setEditName] = React.useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    setCsvs(getSavedCSVs());
  }, []);
  const handleRename = (id: number) => {
    updateCsvInStorage(id, { name: editName });
    setEditingId(null);
    setCsvs(getSavedCSVs());
  };
  const handleDelete = (id: number) => {
    deleteCsvFromStorage(id);
    setCsvs(getSavedCSVs());
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
      e.target.value = '';
    }
  };
  return (
    <Box sx={{ p: 4, color: '#F3F4F6', bgcolor: '#181A1B', minHeight: '100vh' }}>
      <h2>CSV Management</h2>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" color="primary" onClick={() => fileInputRef.current?.click()}>Upload CSV</Button>
        <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileChange} />
      </Box>
      <table style={{ width: '100%', color: '#F3F4F6', background: '#23262F', borderRadius: 8, overflow: 'hidden' }}>
        <thead>
          <tr style={{ background: '#232946' }}>
            <th style={{ textAlign: 'left', padding: 8 }}>Filename</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Labels</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Timestamp</th>
            <th style={{ textAlign: 'left', padding: 8 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {csvs.map((csv: CsvFile) => {
            const lines = csv.content.split(/\r?\n/).filter(Boolean);
            const labelCount = Math.max(0, lines.length - 1);
            return (
              <tr key={csv.id} style={{ borderBottom: '1px solid #232946' }}>
                <td style={{ padding: 8 }}>
                  {csv.name}
                </td>
                <td style={{ padding: 8 }}>{labelCount}</td>
                <td style={{ padding: 8 }}>{new Date(csv.timestamp).toLocaleString()}</td>
                <td style={{ padding: 8, display: 'flex', gap: 2, alignItems: 'center' }}>
                  {editingId === csv.id ? (
                    <>
                      <input value={editName} onChange={e => setEditName(e.target.value)} style={{ fontSize: 15, padding: 2, borderRadius: 4, border: '1px solid #232946', background: '#fff', color: '#232946', width: 100 }} />
                      <IconButton size="small" onClick={() => handleRename(csv.id)} title="Save" sx={{ color: '#4caf50', p: 0.5 }}>
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => setEditingId(null)} title="Cancel" sx={{ color: '#e53935', p: 0.5 }}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </>
                  ) : (
                    <>
                      <IconButton size="small" onClick={() => { setEditingId(csv.id); setEditName(csv.name); }} title="Edit" sx={{ color: '#aaa', p: 0.5 }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => onView(csv)} title="View" sx={{ color: '#1976d2', p: 0.5 }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(csv.id)} title="Delete" sx={{ color: '#e53935', p: 0.5 }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {csvs.length === 0 && <div style={{ color: '#888', marginTop: 24 }}>No CSVs uploaded yet.</div>}
    </Box>
  );
}

function CsvPreviewPage({ file, onUseCsv, csvData }: { file?: File | null, onUseCsv: () => void, csvData?: { name: string, content: string } }) {
  const [fields, setFields] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [fieldEdits, setFieldEdits] = useState<{ value: string; hidden: boolean }[]>([]);
  const [cardWidth, setCardWidth] = useState(340);
  const [cardHeight, setCardHeight] = useState(220);
  const [fontSize, setFontSize] = useState(15);
  const [kerning, setKerning] = useState(0);
  const [padding, setPadding] = useState(16);
  const [spacing, setSpacing] = useState(18);
  const [widthUnit, setWidthUnit] = useState('px');
  const [heightUnit, setHeightUnit] = useState('px');
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    // Always re-parse when csvData or file changes
    let text = '';
    if (csvData && csvData.content) {
      text = csvData.content;
    } else if (file) {
      // Read from file
      const reader = new FileReader();
      reader.onload = (e) => {
        const t = e.target?.result as string;
        parseCsvText(t);
      };
      reader.readAsText(file);
      return;
    } else {
      setFields([]);
      setFieldEdits([]);
      setRows([]);
      return;
    }
    parseCsvText(text);
    function parseCsvText(text: string) {
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      const rawFields = lines[0].split(',').map(f => f.replace(/[{}]/g, '').trim());
      setFields(rawFields);
      setFieldEdits(rawFields.map(f => ({ value: f, hidden: false })));
      setRows(lines.slice(1).map(line => line.split(',')));
    }
  }, [file, csvData]);

  const handleFieldEdit = (idx: number, value: string) => {
    setFieldEdits(edits => edits.map((f, i) => i === idx ? { ...f, value } : f));
  };
  const handleHide = (idx: number) => {
    setFieldEdits(edits => edits.map((f, i) => i === idx ? { ...f, hidden: !f.hidden } : f));
  };
  const handleDelete = (idx: number) => {
    setFieldEdits(edits => edits.filter((_, i) => i !== idx));
    setFields(fs => fs.filter((_, i) => i !== idx));
    setRows(rs => rs.map(row => row.filter((_, i) => i !== idx)));
  };

  // Convert width/height to px for preview
  const cardWidthPx = cardWidth * (UNIT_FACTORS[widthUnit] || 1);
  const cardHeightPx = cardHeight * (UNIT_FACTORS[heightUnit] || 1);

  // Drag and drop handlers for field reordering
  const handleDragStart = (idx: number) => setDragIdx(idx);
  const handleDragOver = (idx: number) => {
    if (dragIdx !== null && dragIdx !== idx) setDragOverIdx(idx);
  };
  const handleDrop = () => {
    if (dragIdx === null || dragOverIdx === null || dragIdx === dragOverIdx) {
      setDragIdx(null); setDragOverIdx(null); return;
    }
    setFieldEdits(edits => {
      const arr = [...edits];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(dragOverIdx, 0, moved);
      return arr;
    });
    setRows(rs => rs.map(row => {
      const arr = [...row];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(dragOverIdx, 0, moved);
      return arr;
    }));
    setDragIdx(null); setDragOverIdx(null);
  };

  if (!file && !csvData) {
    return (
      <Box sx={{ color: '#F3F4F6', p: 4 }}>
        No CSV selected.<br />
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/csvs')}>Back to CSV Management</Button>
      </Box>
    );
  }
  const visibleFields = fieldEdits.filter(f => !f.hidden);
  return (
    <Box sx={{ display: 'flex', height: '100%', bgcolor: '#181A1B', color: '#F3F4F6' }}>
      <Box sx={{ flex: 1, p: 4, minWidth: 0 }}>
        <h2>CSV Preview</h2>
        <div style={{ marginBottom: 16 }}>
          <b>Fields:</b>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            {fieldEdits.map((f, idx) => (
              <li
                key={idx}
                style={{ marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, opacity: dragIdx === idx ? 0.5 : 1, background: dragOverIdx === idx ? '#232946' : undefined, borderRadius: 4 }}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={e => { e.preventDefault(); handleDragOver(idx); }}
                onDrop={handleDrop}
                onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              >
                <input
                  value={f.value}
                  onChange={e => handleFieldEdit(idx, e.target.value)}
                  style={{ fontSize: 14, padding: '2px 6px', borderRadius: 4, border: '1px solid #232946', background: f.hidden ? '#23262F' : '#fff', color: '#232946', minWidth: 80 }}
                  disabled={f.hidden}
                />
                <IconButton size="small" onClick={() => handleHide(idx)} title={f.hidden ? 'Show' : 'Hide'} sx={{ color: '#888' }}>
                  {f.hidden ? <VisibilityIcon /> : <VisibilityIcon />}
                </IconButton>
                <IconButton size="small" onClick={() => handleDelete(idx)} title="Delete" sx={{ color: '#e53935' }}>
                  <DeleteIcon />
                </IconButton>
                <span style={{ cursor: 'grab', color: '#aaa', fontSize: 16, marginLeft: 4 }}>☰</span>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginBottom: 16 }}><b>Labels imported:</b> {rows.length}</div>
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          <TextField label="Width" type="number" size="small" value={cardWidth} onChange={e => setCardWidth(Number(e.target.value))} sx={{ width: 90 }} InputProps={{ style: { color: '#F3F4F6', background: '#23262F' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
          <select value={widthUnit} onChange={e => setWidthUnit(e.target.value)} style={{ marginRight: 8, height: 32, borderRadius: 4, background: '#23262F', color: '#F3F4F6', border: '1px solid #232946' }}>
            <option value="px">px</option>
            <option value="in">in</option>
            <option value="cm">cm</option>
            <option value="mm">mm</option>
          </select>
          <TextField label="Height" type="number" size="small" value={cardHeight} onChange={e => setCardHeight(Number(e.target.value))} sx={{ width: 90 }} InputProps={{ style: { color: '#F3F4F6', background: '#23262F' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
          <select value={heightUnit} onChange={e => setHeightUnit(e.target.value)} style={{ marginRight: 8, height: 32, borderRadius: 4, background: '#23262F', color: '#F3F4F6', border: '1px solid #232946' }}>
            <option value="px">px</option>
            <option value="in">in</option>
            <option value="cm">cm</option>
            <option value="mm">mm</option>
          </select>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, background: 'none', border: 'none', ml: 2 }}>
            <TextField label="Font" type="number" size="small" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} sx={{ width: 80 }} InputProps={{ style: { color: '#F3F4F6', background: '#23262F' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
            <TextField label="Line Height" type="number" size="small" value={spacing} onChange={e => setSpacing(Number(e.target.value))} sx={{ width: 110 }} InputProps={{ style: { color: '#F3F4F6', background: '#23262F' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
            <TextField label="Kerning" type="number" size="small" value={kerning} onChange={e => setKerning(Number(e.target.value))} sx={{ width: 90 }} InputProps={{ style: { color: '#F3F4F6', background: '#23262F' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
          </Box>
          <TextField label="Padding" type="number" size="small" value={padding} onChange={e => setPadding(Number(e.target.value))} sx={{ width: 90, ml: 2 }} InputProps={{ style: { color: '#F3F4F6', background: '#23262F' } }} InputLabelProps={{ style: { color: '#aaa' } }} />
        </Box>
        <Button variant="contained" color="primary" onClick={onUseCsv} disabled={!visibleFields.length}>Use These Fields</Button>
      </Box>
      <Box sx={{ flex: 1.2, p: 4, minWidth: 0, bgcolor: '#23262F', borderLeft: '1px solid #232946', display: 'flex', flexDirection: 'column', gap: 3 }}>
        <h3 style={{ color: '#F3F4F6', margin: 0, marginBottom: 16 }}>Label Preview</h3>
        {rows.length === 0 && <div style={{ color: '#888' }}>No data rows in CSV.</div>}
        {rows.slice(0, 3).map((row, i) => (
          <Box key={i} sx={{ bgcolor: '#fff', color: '#232946', borderRadius: 2, p: `${padding}px`, mb: 2, boxShadow: 2, minWidth: 0, width: cardWidthPx, height: cardHeightPx, overflow: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {fieldEdits.map((f, j) => f.hidden ? null : (
              <div key={j} style={{ fontSize, lineHeight: `${spacing}px`, letterSpacing: `${kerning}px`, marginBottom: 2 }}>
                <b>{f.value}:</b> {row[j] ?? ''}
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
  const [csvListView, setCsvListView] = useState(false);
  const [csvPreviewData, setCsvPreviewData] = useState<any>(null);
  const navigate = useNavigate();

  const handleHome = () => {
    setShowSettings(false);
    setSelectedId(null);
  };

  const handleCsvUpload = (file: File) => {
    // Read file and save to localStorage
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const name = file.name.replace(/\.csv$/i, '') + '-' + new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + '.csv';
      saveCsvToStorage({ name, content });
      setCsvListView(true);
      navigate('/csvs');
    };
    reader.readAsText(file);
  };

  const handleUseCsv = () => {
    // TODO: Use the CSV fields for something
    navigate('/');
  };

  const handleViewCsv = (csv: CsvFile) => {
    setCsvPreviewData({ ...csv }); // always set a new object
    setTimeout(() => navigate('/csv-preview'), 0); // ensure state is set before navigation
  };

  return (
    <Box sx={{ display: 'flex', position: 'fixed', inset: 0, height: '100vh', width: '100vw', bgcolor: '#181A1B', overflow: 'hidden' }}>
      <CssBaseline />
      <Sidebar width={drawerWidth} onSettingsClick={() => setShowSettings(true)} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Routes>
          <Route path="/csv-preview" element={<CsvPreviewPage key={csvPreviewData?.id || 'file'} file={csvFile} onUseCsv={handleUseCsv} csvData={csvPreviewData} />} />
          <Route path="/csvs" element={<CsvManagementPage onView={handleViewCsv} onUpload={handleCsvUpload} />} />
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
