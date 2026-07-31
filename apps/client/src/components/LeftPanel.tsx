import React, { useState } from 'react';
import { LayersPanel } from './LayersPanel';
import { useShapesStore } from '../store/useShapesStore';
import { ShapeFactory } from '../canvas/ShapeFactory';
import {
  Layers, HelpCircle, Play, MousePointer, Key,
  ZoomIn, Move, Copy, Trash2, RotateCcw,
  Keyboard, ChevronDown, ChevronRight, Sparkles
} from 'lucide-react';

interface ShortcutRowProps {
  keys: string[];
  description: string;
}
const ShortcutRow: React.FC<ShortcutRowProps> = ({ keys, description }) => (
  <div className="flex items-center justify-between py-1.5 border-b border-zinc-800/30 last:border-0">
    <span className="text-[11px] text-zinc-500 leading-relaxed">{description}</span>
    <div className="flex items-center space-x-0.5 shrink-0 ml-2">
      {keys.map((k, i) => (
        <React.Fragment key={i}>
          <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700/60 rounded text-[9px] font-mono text-zinc-400 leading-none">
            {k}
          </kbd>
          {i < keys.length - 1 && <span className="text-zinc-700 text-[9px] mx-0.5">+</span>}
        </React.Fragment>
      ))}
    </div>
  </div>
);

interface GuideSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  shortcuts: { keys: string[]; description: string }[];
}
const GUIDE_SECTIONS: GuideSection[] = [
  {
    title: 'Tools',
    icon: <MousePointer className="w-3 h-3" />,
    color: 'text-indigo-400',
    shortcuts: [
      { keys: ['V'], description: 'Select tool' },
      { keys: ['H'], description: 'Hand / Pan tool' },
      { keys: ['R'], description: 'Rectangle' },
      { keys: ['O'], description: 'Ellipse' },
      { keys: ['L'], description: 'Line' },
      { keys: ['T'], description: 'Text' },
      { keys: ['F'], description: 'Frame' },
    ],
  },
  {
    title: 'Canvas Navigation',
    icon: <Move className="w-3 h-3" />,
    color: 'text-cyan-400',
    shortcuts: [
      { keys: ['Ctrl', 'Scroll'], description: 'Zoom in / out' },
      { keys: ['Space', 'Drag'], description: 'Pan canvas' },
      { keys: ['Ctrl', '0'], description: 'Reset zoom' },
      { keys: ['Ctrl', 'Shift', 'H'], description: 'Fit to screen' },
    ],
  },
  {
    title: 'Editing',
    icon: <Copy className="w-3 h-3" />,
    color: 'text-amber-400',
    shortcuts: [
      { keys: ['Ctrl', 'D'], description: 'Duplicate selection' },
      { keys: ['Ctrl', 'Z'], description: 'Undo' },
      { keys: ['Ctrl', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['Ctrl', 'A'], description: 'Select all' },
      { keys: ['Del'], description: 'Delete selection' },
      { keys: ['Ctrl', 'C'], description: 'Copy' },
      { keys: ['Ctrl', 'V'], description: 'Paste' },
    ],
  },
  {
    title: 'Arrange',
    icon: <Layers className="w-3 h-3" />,
    color: 'text-emerald-400',
    shortcuts: [
      { keys: ['Ctrl', ']'], description: 'Bring forward' },
      { keys: ['Ctrl', '['], description: 'Send backward' },
      { keys: ['Shift', '?'], description: 'Shortcuts guide' },
    ],
  },
];

const VECTOR_ICONS = [
  { name: 'Home', path: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10' },
  { name: 'User', path: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z' },
  { name: 'Settings', path: 'M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z' },
  { name: 'Bell', path: 'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0' },
  { name: 'Search', path: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z M21 21l-4.3-4.3' },
  { name: 'Heart', path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z' },
  { name: 'Star', path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
  { name: 'Cart', path: 'M9 21a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M20 21a1 1 0 1 0 0 2 1 1 0 0 0 0-2z M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' },
  { name: 'Trash', path: 'M3 6h18 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2 M10 11v6 M14 11v6' },
  { name: 'Plus', path: 'M12 5v14 M5 12h14' },
  { name: 'Check', path: 'M20 6L9 17l-5-5' },
  { name: 'Play', path: 'M5 3l14 9-14 9V3z' },
  { name: 'Info', path: 'M12 16v-4 M12 8h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z' },
  { name: 'Alert', path: 'M12 8v4 M12 16h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z' },
  { name: 'Mail', path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6' },
  { name: 'Calendar', path: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z M16 2v4 M8 2v4 M3 10h18' },
  { name: 'Edit', path: 'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z' },
  { name: 'Share', path: 'M8.59 13.51l6.83 3.98 M15.41 6.51l-6.82 3.98 M21 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M9 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z M21 19a3 3 0 1 1-6 0 3 3 0 0 1 6 0z' },
  { name: 'Cloud', path: 'M18 10h-.08A7 7 0 0 0 4.75 12.02A4 4 0 0 0 5 20h13a5 5 0 0 0 0-10z' },
  { name: 'Image', path: 'M3 3h18v18H3z M8.5 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z M21 15l-5-5L5 21' },
  { name: 'Menu', path: 'M3 12h18 M3 6h18 M3 18h18' },
  { name: 'ArrowRight', path: 'M5 12h14 M12 5l7 7-7 7' },
  { name: 'Globe', path: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c-2.7 0-4.5 4.5-4.5 10s1.8 10 4.5 10 4.5-4.5 4.5-10S14.7 2 12 2z M2 12h20' }
];

export const LeftPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'layers' | 'icons' | 'guide'>('layers');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Tools: true,
    'Canvas Navigation': false,
    Editing: false,
    Arrange: false,
  });
  const { shapes, addShape, selectShape } = useShapesStore();

  const toggleSection = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  const handleAddIcon = (icon: typeof VECTOR_ICONS[0]) => {
    useShapesStore.getState().pushHistory();
    const zIndex = shapes.length;
    const newShape = {
      ...ShapeFactory.createRectangle({ x: 200, y: 200, width: 48, height: 48, zIndex }),
      name: `Icon - ${icon.name}`,
      fill: { color: 'transparent', opacity: 0 },
      stroke: { color: '#ffffff', width: 2, opacity: 1 },
      iconPath: icon.path
    };
    addShape(newShape as any);
    selectShape(newShape.id);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center space-x-0.5 bg-zinc-900/40 rounded-xl p-0.5 mb-3 shrink-0">
        <button
          onClick={() => setActiveTab('layers')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === 'layers'
              ? 'bg-zinc-800 text-zinc-200 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Layers className="w-3 h-3" />
          <span>Layers</span>
        </button>
        <button
          onClick={() => setActiveTab('icons')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === 'icons'
              ? 'bg-zinc-800 text-zinc-200 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>Icons</span>
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`flex-1 flex items-center justify-center space-x-1 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${
            activeTab === 'guide'
              ? 'bg-zinc-800 text-zinc-200 shadow-sm'
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Keyboard className="w-3 h-3" />
          <span>Guide</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto min-h-0">
        {activeTab === 'layers' ? (
          <LayersPanel />
        ) : activeTab === 'icons' ? (
          <div className="space-y-3 px-1">
            <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-3 py-2.5">
              <p className="text-[10px] text-indigo-400 font-semibold mb-0.5">Vector Icons</p>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Click any icon below to spawn it as a fully resizable vector shape on the canvas.
              </p>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {VECTOR_ICONS.map((icon) => (
                <button
                  key={icon.name}
                  onClick={() => handleAddIcon(icon)}
                  className="flex flex-col items-center justify-center p-2 bg-zinc-900/40 hover:bg-zinc-800/50 border border-zinc-800/40 hover:border-zinc-700/60 rounded-xl transition-all group"
                  title={`Add ${icon.name} Icon`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400 group-hover:text-indigo-400 transition-colors">
                    <path d={icon.path} />
                  </svg>
                  <span className="text-[8px] text-zinc-600 group-hover:text-zinc-400 mt-1 truncate w-full text-center">{icon.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-0.5">
            <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-xl px-3 py-2.5 mb-3">
              <p className="text-[10px] text-indigo-400 font-semibold mb-0.5">Quick Start</p>
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Select a tool, then click &amp; drag on the canvas to draw. Use <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[8px] font-mono">V</kbd> to return to select mode.
              </p>
            </div>
            {GUIDE_SECTIONS.map((section) => (
              <div key={section.title} className="rounded-xl overflow-hidden border border-zinc-800/40">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900/40 hover:bg-zinc-800/30 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className={section.color}>{section.icon}</span>
                    <span className="text-[11px] font-semibold text-zinc-300">{section.title}</span>
                  </div>
                  {openSections[section.title] ? (
                    <ChevronDown className="w-3 h-3 text-zinc-600" />
                  ) : (
                    <ChevronRight className="w-3 h-3 text-zinc-600" />
                  )}
                </button>
                {openSections[section.title] && (
                  <div className="px-3 pb-1 pt-0.5 bg-zinc-900/20">
                    {section.shortcuts.map((s, i) => (
                      <ShortcutRow key={i} keys={s.keys} description={s.description} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
