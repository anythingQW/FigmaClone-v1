import React from 'react';
import { X, Keyboard } from 'lucide-react';
interface ShortcutsGuideProps {
  isOpen: boolean;
  onClose: () => void;
}
const sections = [
  {
    title: 'Tools',
    items: [
      { keys: ['V'], desc: 'Select Tool' },
      { keys: ['H'], desc: 'Hand / Pan Tool' },
      { keys: ['R'], desc: 'Rectangle Tool' },
      { keys: ['O'], desc: 'Ellipse Tool' },
      { keys: ['L'], desc: 'Line Tool' },
      { keys: ['T'], desc: 'Text Tool' },
      { keys: ['F'], desc: 'Frame Tool' },
    ],
  },
  {
    title: 'Selection',
    items: [
      { keys: ['Ctrl', 'A'], desc: 'Select All' },
      { keys: ['Shift', 'Click'], desc: 'Add to Selection' },
      { keys: ['Ctrl', 'Click'], desc: 'Toggle Selection' },
      { keys: ['Click Empty'], desc: 'Deselect All' },
    ],
  },
  {
    title: 'Editing',
    items: [
      { keys: ['Ctrl', 'D'], desc: 'Duplicate Selection' },
      { keys: ['Del'], desc: 'Delete Selection' },
      { keys: ['Drag'], desc: 'Move Selected Shapes' },
    ],
  },
  {
    title: 'Navigation',
    items: [
      { keys: ['Scroll'], desc: 'Pan Canvas' },
      { keys: ['Ctrl', 'Scroll'], desc: 'Zoom In / Out' },
      { keys: ['Space', 'Drag'], desc: 'Pan Canvas' },
      { keys: ['Middle Click'], desc: 'Pan Canvas' },
    ],
  },
];
export const ShortcutsGuide: React.FC<ShortcutsGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[520px] max-h-[80vh] bg-[#0c0c0e] border border-zinc-800/80 rounded-2xl shadow-2xl overflow-hidden animate-modal-in">
        <div className="relative px-8 pt-8 pb-5">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-3 mb-1">
            <div className="h-8 w-8 rounded-lg bg-amber-600 flex items-center justify-center">
              <Keyboard className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-bold text-zinc-100">Keyboard Shortcuts</h2>
          </div>
          <p className="text-sm text-zinc-500 ml-11">Master these shortcuts to speed up your design workflow.</p>
        </div>
        <div className="px-8 pb-8 space-y-5 overflow-y-auto max-h-[55vh]">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-2.5">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-zinc-900/60 transition-colors">
                    <span className="text-xs text-zinc-400">{item.desc}</span>
                    <div className="flex items-center space-x-1">
                      {item.keys.map((key, ki) => (
                        <span key={ki}>
                          {ki > 0 && <span className="text-zinc-700 text-[10px] mx-0.5">+</span>}
                          <kbd className="inline-block px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700/60 text-[10px] font-mono text-zinc-300 min-w-[22px] text-center shadow-sm">
                            {key}
                          </kbd>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
