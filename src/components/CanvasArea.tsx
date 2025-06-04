import React, { useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { Stage, Layer, Rect, Text, Group, Transformer } from 'react-konva';
// import useImage from 'use-image'; // For real image support later

const LABEL_WIDTH = 400;
const LABEL_HEIGHT = 200;

// Element types
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

let idCounter = 2;

interface CanvasAreaProps {
  elements: any[];
  setElements: (els: any[]) => void;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ elements, setElements, selectedId, setSelectedId }) => {
  const stageRef = useRef<any>(null);
  const trRef = useRef<any>(null);
  const nodeRefs = useRef<{ [id: string]: any }>({});

  useEffect(() => {
    if (selectedId && trRef.current && nodeRefs.current[selectedId]) {
      trRef.current.nodes([nodeRefs.current[selectedId]]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedId, elements]);

  const handleDrag = (id: string, x: number, y: number) => {
    setElements(elements.map(el => el.id === id ? { ...el, x, y } : el));
  };

  const handleTransform = (id: string, node: any) => {
    const el = elements.find(e => e.id === id);
    if (!el) return;
    let updates: any = { x: node.x(), y: node.y() };
    if (el.type === 'rect' || el.type === 'image') {
      updates.width = Math.max(10, node.width() * node.scaleX());
      updates.height = Math.max(10, node.height() * node.scaleY());
    }
    if (el.type === 'text') {
      updates.fontSize = Math.max(8, node.fontSize() * node.scaleY());
    }
    if (el.type === 'qr') {
      updates.size = Math.max(10, node.width() * node.scaleX());
    }
    setElements(elements.map(e => e.id === id ? { ...e, ...updates } : e));
    node.scaleX(1);
    node.scaleY(1);
  };

  const addElement = (type: string) => {
    idCounter++;
    if (type === 'text') {
      setElements([
        ...elements,
        {
          id: `text-${idCounter}`,
          type: 'text',
          x: 100,
          y: 100,
          text: 'New Text',
          fontSize: 24,
          fontStyle: 'normal',
          fill: '#232946',
        },
      ]);
    } else if (type === 'rect') {
      setElements([
        ...elements,
        {
          id: `rect-${idCounter}`,
          type: 'rect',
          x: 120,
          y: 60,
          width: 80,
          height: 40,
          fill: '#ffb800',
          stroke: '#232946',
          strokeWidth: 2,
        },
      ]);
    } else if (type === 'image') {
      setElements([
        ...elements,
        {
          id: `img-${idCounter}`,
          type: 'image',
          x: 180,
          y: 80,
          width: 60,
          height: 60,
          src: '',
        },
      ]);
    } else if (type === 'qr') {
      setElements([
        ...elements,
        {
          id: `qr-${idCounter}`,
          type: 'qr',
          x: 200,
          y: 120,
          size: 60,
          data: 'https://example.com',
        },
      ]);
    }
  };

  const autoAlign = () => {
    // Arrange text/rect vertically, QR/image to right, with even spacing
    const leftEls = elements.filter(e => (e.type === 'text' || e.type === 'rect') && !e.hidden);
    const rightEls = elements.filter(e => (e.type === 'qr' || e.type === 'image') && !e.hidden);
    const spacing = 8;
    let y = 30;
    const leftX = 24;
    const rightX = LABEL_WIDTH - 100;
    const newEls = elements.map(e => {
      if (e.hidden) return e;
      if (e.type === 'text' || e.type === 'rect') {
        const out = { ...e, x: leftX, y };
        y += (e.type === 'rect' ? (e.height ?? 40) : (e.fontSize ?? 24) + 8) + spacing;
        return out;
      }
      return e;
    });
    let y2 = 60;
    rightEls.forEach((e, i) => {
      const idx = newEls.findIndex(el => el.id === e.id);
      if (idx !== -1) {
        newEls[idx] = { ...e, x: rightX, y: y2 };
        y2 += (e.size ?? e.height ?? 60) + spacing;
      }
    });
    setElements(newEls);
  };

  return (
    <Box sx={{ flex: 1, bgcolor: '#fff', m: 2, borderRadius: 2, boxShadow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0, position: 'relative' }}>
      {/* Floating Toolbar */}
      <Box sx={{ position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 10, bgcolor: '#fff', borderRadius: 2, boxShadow: 2, p: 1, display: 'flex', gap: 1 }}>
        <ButtonGroup variant="contained" size="small">
          <Button onClick={() => addElement('text')}>Text</Button>
          <Button onClick={() => addElement('rect')}>Rect</Button>
          <Button onClick={() => addElement('image')}>Image</Button>
          <Button onClick={() => addElement('qr')}>QR</Button>
        </ButtonGroup>
        <Button variant="outlined" size="small" sx={{ ml: 2 }} onClick={autoAlign}>Auto Align</Button>
      </Box>
      <Stage
        width={LABEL_WIDTH + 40}
        height={LABEL_HEIGHT + 40}
        ref={stageRef}
        style={{ background: '#f8fafc', borderRadius: 12 }}
      >
        <Layer>
          {/* Label boundary */}
          <Rect
            x={20}
            y={20}
            width={LABEL_WIDTH}
            height={LABEL_HEIGHT}
            fill="#fff"
            stroke="#232946"
            strokeWidth={2}
            cornerRadius={12}
            shadowBlur={2}
            listening={false}
          />
          {/* Render elements */}
          {elements.map(el => {
            if (el.hidden) return null;
            const isLocked = !!el.locked;
            if (el.type === 'text') {
              return (
                <Group key={el.id}>
                  <Text
                    ref={node => { nodeRefs.current[el.id] = node; }}
                    x={el.x}
                    y={el.y}
                    text={el.text}
                    fontSize={el.fontSize}
                    fontStyle={el.fontStyle}
                    fill={el.fill}
                    draggable={!isLocked}
                    onDragEnd={e => handleDrag(el.id, e.target.x(), e.target.y())}
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                  />
                  {selectedId === el.id && (
                    <Transformer
                      ref={trRef}
                      rotateEnabled={!isLocked}
                      enabledAnchors={['middle-left', 'middle-right']}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 30) return oldBox;
                        return newBox;
                      }}
                      onTransformEnd={e => handleTransform(el.id, nodeRefs.current[el.id])}
                    />
                  )}
                  {selectedId === el.id && (
                    <Rect
                      x={el.x - 6}
                      y={el.y - 6}
                      width={120}
                      height={40}
                      stroke="#3f51b5"
                      strokeWidth={2}
                      dash={[6, 4]}
                      listening={false}
                    />
                  )}
                </Group>
              );
            }
            if (el.type === 'rect') {
              return (
                <Group key={el.id}>
                  <Rect
                    ref={node => { nodeRefs.current[el.id] = node; }}
                    x={el.x}
                    y={el.y}
                    width={el.width ?? 60}
                    height={el.height ?? 60}
                    fill={el.fill}
                    stroke={el.stroke}
                    strokeWidth={el.strokeWidth}
                    draggable={!isLocked}
                    onDragEnd={e => handleDrag(el.id, e.target.x(), e.target.y())}
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                  />
                  {selectedId === el.id && (
                    <Transformer
                      ref={trRef}
                      rotateEnabled={!isLocked}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right']}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 10 || newBox.height < 10) return oldBox;
                        return newBox;
                      }}
                      onTransformEnd={e => handleTransform(el.id, nodeRefs.current[el.id])}
                    />
                  )}
                  {selectedId === el.id && (
                    <Rect
                      x={el.x - 4}
                      y={el.y - 4}
                      width={(el.width ?? 60) + 8}
                      height={(el.height ?? 60) + 8}
                      stroke="#3f51b5"
                      strokeWidth={2}
                      dash={[6, 4]}
                      listening={false}
                    />
                  )}
                </Group>
              );
            }
            if (el.type === 'image') {
              return (
                <Group key={el.id}>
                  <Rect
                    ref={node => { nodeRefs.current[el.id] = node; }}
                    x={el.x}
                    y={el.y}
                    width={el.width ?? 60}
                    height={el.height ?? 60}
                    fill="#e0e0e0"
                    stroke="#aaa"
                    strokeWidth={1}
                    draggable={!isLocked}
                    onDragEnd={e => handleDrag(el.id, e.target.x(), e.target.y())}
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                  />
                  {selectedId === el.id && (
                    <Transformer
                      ref={trRef}
                      rotateEnabled={!isLocked}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right']}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 10 || newBox.height < 10) return oldBox;
                        return newBox;
                      }}
                      onTransformEnd={e => handleTransform(el.id, nodeRefs.current[el.id])}
                    />
                  )}
                  <Text
                    x={el.x + 8}
                    y={el.y + (el.height ?? 60) / 2 - 10}
                    text="Image"
                    fontSize={16}
                    fill="#888"
                  />
                  {selectedId === el.id && (
                    <Rect
                      x={el.x - 4}
                      y={el.y - 4}
                      width={(el.width ?? 60) + 8}
                      height={(el.height ?? 60) + 8}
                      stroke="#3f51b5"
                      strokeWidth={2}
                      dash={[6, 4]}
                      listening={false}
                    />
                  )}
                </Group>
              );
            }
            if (el.type === 'qr') {
              return (
                <Group key={el.id}>
                  <Rect
                    ref={node => { nodeRefs.current[el.id] = node; }}
                    x={el.x}
                    y={el.y}
                    width={el.size ?? 60}
                    height={el.size ?? 60}
                    fill="#fff"
                    stroke="#232946"
                    strokeWidth={2}
                    draggable={!isLocked}
                    onDragEnd={e => handleDrag(el.id, e.target.x(), e.target.y())}
                    onClick={() => setSelectedId(el.id)}
                    onTap={() => setSelectedId(el.id)}
                  />
                  {selectedId === el.id && (
                    <Transformer
                      ref={trRef}
                      rotateEnabled={!isLocked}
                      enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right']}
                      boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 10 || newBox.height < 10) return oldBox;
                        return newBox;
                      }}
                      onTransformEnd={e => handleTransform(el.id, nodeRefs.current[el.id])}
                    />
                  )}
                  <Text
                    x={el.x + 8}
                    y={el.y + (el.size ?? 60) / 2 - 10}
                    text="QR"
                    fontSize={18}
                    fill="#232946"
                  />
                  {selectedId === el.id && (
                    <Rect
                      x={el.x - 4}
                      y={el.y - 4}
                      width={(el.size ?? 60) + 8}
                      height={(el.size ?? 60) + 8}
                      stroke="#3f51b5"
                      strokeWidth={2}
                      dash={[6, 4]}
                      listening={false}
                    />
                  )}
                </Group>
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </Box>
  );
};

export default CanvasArea; 