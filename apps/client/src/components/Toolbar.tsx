import React from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { useShapesStore, ToolType } from '../store/useShapesStore';
import {
  MousePointer, Hand, Grid, ZoomIn, ZoomOut, RotateCcw,
  Square, Circle, Minus, ArrowUpRight, Type,
  Frame, Hexagon, Star,
} from 'lucide-react';
interface ToolButtonProps {
  tool: ToolType;
  activeTool: ToolType;
  icon: React.ReactNode;
  label: string;
  shortcut?: string;
  onClick: () => void;
}
const ToolButton: React.FC<ToolButtonProps> = ({ tool, activeTool, icon, label, shortcut, onClick }) => (
  <button
    onClick={onClick}
    title={`${label}${shortcut ? ` (${shortcut})` : ''}`}
    className={`p-2 rounded-lg transition-all duration-150 ${
      activeTool === tool
        ? 'bg-indigo-500/20 text-indigo-400 shadow-inner shadow-indigo-500/10 ring-1 ring-indigo-500/30'
        : 'hover:bg-zinc-800/80 text-zinc-500 hover:text-zinc-300'
    }`}
  >
    {icon}
  </button>
);
export const Toolbar: React.FC = () => {
  const { camera, grid, zoomAt, resetCamera, toggleGrid, viewport } = useCanvasStore();
  const { activeTool, setActiveTool } = useShapesStore();
  const handleZoomIn = () => {
    zoomAt({ x: viewport.width / 2, y: viewport.height / 2 }, 1.25);
  };
  const handleZoomOut = () => {
    zoomAt({ x: viewport.width / 2, y: viewport.height / 2 }, 0.8);
  };
  const sz = 'w-[15px] h-[15px]';
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-panel rounded-xl px-2 py-1.5 shadow-2xl shadow-black/40 flex items-center space-x-0.5 text-zinc-300 z-20 animate-slide-up">
      <ToolButton tool="select" activeTool={activeTool} label="Select" shortcut="V"
        icon={<MousePointer className={sz} />} onClick={() => setActiveTool('select')} />
      <ToolButton tool="hand" activeTool={activeTool} label="Hand" shortcut="H"
        icon={<Hand className={sz} />} onClick={() => setActiveTool('hand')} />
      <div className="h-5 w-px bg-zinc-800/80 mx-1" />
      <ToolButton tool="rectangle" activeTool={activeTool} label="Rectangle" shortcut="R"
        icon={<Square className={sz} />} onClick={() => setActiveTool('rectangle')} />
      <ToolButton tool="ellipse" activeTool={activeTool} label="Ellipse" shortcut="O"
        icon={<Circle className={sz} />} onClick={() => setActiveTool('ellipse')} />
      <ToolButton tool="line" activeTool={activeTool} label="Line" shortcut="L"
        icon={<Minus className={sz} />} onClick={() => setActiveTool('line')} />
      <ToolButton tool="arrow" activeTool={activeTool} label="Arrow"
        icon={<ArrowUpRight className={sz} />} onClick={() => setActiveTool('arrow')} />
      <ToolButton tool="text" activeTool={activeTool} label="Text" shortcut="T"
        icon={<Type className={sz} />} onClick={() => setActiveTool('text')} />
      <ToolButton tool="frame" activeTool={activeTool} label="Frame" shortcut="F"
        icon={<Frame className={sz} />} onClick={() => setActiveTool('frame')} />
      <ToolButton tool="polygon" activeTool={activeTool} label="Polygon"
        icon={<Hexagon className={sz} />} onClick={() => setActiveTool('polygon')} />
      <ToolButton tool="star" activeTool={activeTool} label="Star"
        icon={<Star className={sz} />} onClick={() => setActiveTool('star')} />
      <div className="h-5 w-px bg-zinc-800/80 mx-1" />
      <button
        onClick={toggleGrid}
        title="Toggle Grid"
        className={`p-2 rounded-lg transition-all duration-150 ${
          grid.enabled
            ? 'bg-indigo-500/20 text-indigo-400 ring-1 ring-indigo-500/30'
            : 'hover:bg-zinc-800/80 text-zinc-500 hover:text-zinc-300'
        }`}
      >
        <Grid className={sz} />
      </button>
      <div className="h-5 w-px bg-zinc-800/80 mx-1" />
      <button onClick={handleZoomOut} title="Zoom Out" className="p-2 hover:bg-zinc-800/80 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all">
        <ZoomOut className={sz} />
      </button>
      <span className="text-[11px] font-mono text-zinc-300 w-10 text-center select-none font-medium tabular-nums">
        {Math.round(camera.zoom * 100)}%
      </span>
      <button onClick={handleZoomIn} title="Zoom In" className="p-2 hover:bg-zinc-800/80 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all">
        <ZoomIn className={sz} />
      </button>
      <button onClick={resetCamera} title="Reset View" className="p-2 hover:bg-zinc-800/80 rounded-lg text-zinc-500 hover:text-zinc-300 transition-all">
        <RotateCcw className={sz} />
      </button>
    </div>
  );
};
