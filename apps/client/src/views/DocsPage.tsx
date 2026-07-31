import React, { useState } from 'react';
import {
  BookOpen, ChevronLeft, Search, PenTool, Layers, MousePointer,
  Square, Circle, Type, Box, Sparkles, Key, Zap, Globe,
  Shield, Check, ArrowRight, CornerDownLeft, Command, ArrowUp,
  HelpCircle, Monitor, Smartphone, PresentationIcon, Hexagon,
} from 'lucide-react';
interface DocsPageProps {
  onBack: () => void;
}
const DOCS_NAV = [
  { id: 'intro', title: 'Introduction', icon: <PenTool className="w-3.5 h-3.5" /> },
  { id: 'tools', title: 'Vector Tools', icon: <Square className="w-3.5 h-3.5" /> },
  { id: 'transform', title: 'Transforms & Precision', icon: <MousePointer className="w-3.5 h-3.5" /> },
  { id: 'layers', title: 'Layers & Organization', icon: <Layers className="w-3.5 h-3.5" /> },
  { id: 'templates', title: 'Design Templates', icon: <Sparkles className="w-3.5 h-3.5" /> },
  { id: 'shortcuts', title: 'Keyboard Shortcuts', icon: <Key className="w-3.5 h-3.5" /> },
  { id: 'collaboration', title: 'Live Sync & Realtime', icon: <Globe className="w-3.5 h-3.5" /> },
];
export const DocsPage: React.FC<DocsPageProps> = ({ onBack }) => {
  const [activeSection, setActiveSection] = useState('intro');
  const [searchQuery, setSearchQuery] = useState('');
  const filteredNav = DOCS_NAV.filter((n) =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden select-none">
      <aside className="w-[280px] border-r border-zinc-800/60 glass-panel flex flex-col shrink-0">
        <div className="px-5 pt-6 pb-4 border-b border-zinc-800/40">
          <button
            onClick={onBack}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-all text-[12px] mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Projects</span>
          </button>
          <div className="flex items-center space-x-2.5 mb-4">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[15px] tracking-tight text-zinc-100">Documentation</h2>
              <p className="text-[10px] text-zinc-600">Flavor Editor Guide</p>
            </div>
          </div>
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search docs..."
              className="pl-9 pr-4 py-1.5 w-full bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-[11px] text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 transition-all"
            />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="px-2 pt-1 pb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-600">Table of Contents</p>
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-[12px] transition-all ${
                activeSection === item.id
                  ? 'bg-indigo-500/10 text-indigo-300 font-semibold ring-1 ring-indigo-500/20'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
              }`}
            >
              <span className={activeSection === item.id ? 'text-indigo-400' : 'text-zinc-600'}>
                {item.icon}
              </span>
              <span>{item.title}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-10 max-w-4xl">
        {activeSection === 'intro' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest">Getting Started</span>
              <h1 className="text-3xl font-extrabold text-white mt-1 mb-3">Welcome to Flavor Design System</h1>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Flavor is a high-performance, real-time vector graphic editor built with hardware-accelerated Canvas rendering, resolution-independent vector tools, and live collaboration capabilities.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-2">
              <div className="flex items-center space-x-2 text-indigo-400 font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Core Capabilities</span>
              </div>
              <ul className="text-xs text-zinc-400 space-y-1.5 pl-5 list-disc">
                <li>Resolution-independent 2D Canvas rendering engine with Retina/HiDPI scaling support.</li>
                <li>8-point bounding box handle transform system with 360° rotation stem.</li>
                <li>Categorized layer grouping system for organized complex artboards.</li>
                <li>Pre-built UI component templates for Web, Mobile, Slide Decks, and Wireframes.</li>
              </ul>
            </div>
          </div>
        )}
        {activeSection === 'tools' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest">Canvas & Creation</span>
              <h1 className="text-2xl font-bold text-white mt-1 mb-3">Vector Creation Tools</h1>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Rectangle', key: 'R', desc: 'Creates solid or bordered rectangular vectors with corner radius controls.' },
                { name: 'Ellipse', key: 'O', desc: 'Draws perfect circles or elliptical paths with alpha opacity transparency.' },
                { name: 'Line & Arrow', key: 'L', desc: 'Renders straight directional vector segments with customizable stroke thickness.' },
                { name: 'Text Layer', key: 'T', desc: 'Adds crisp vector text elements with alignment, font size, and weight controls.' },
                { name: 'Frame / Artboard', key: 'F', desc: 'Defines top-level structural containers for mobile and desktop screens.' },
                { name: 'Polygon & Star', key: 'P', desc: 'Geometric multi-sided shapes and star vectors.' },
              ].map((tool, i) => (
                <div key={i} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-zinc-200">{tool.name}</h3>
                    <kbd className="px-2 py-0.5 bg-zinc-800 rounded font-mono text-[10px] text-zinc-400">{tool.key}</kbd>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed">{tool.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'transform' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest">Manipulation</span>
              <h1 className="text-2xl font-bold text-white mt-1 mb-3">Transform & Precision Handles</h1>
              <p className="text-zinc-400 text-sm">
                Selecting any shape on the canvas reveals its interactive bounding box with 8 scale handles and 1 rotation node.
              </p>
            </div>
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                <h4 className="font-semibold text-zinc-200 mb-1">Corner Handles (TL, TR, BL, BR)</h4>
                <p>Drag any corner node to scale both width and height simultaneously.</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                <h4 className="font-semibold text-zinc-200 mb-1">Edge Handles (TC, BC, ML, MR)</h4>
                <p>Drag top/bottom or left/right edge nodes to stretch the shape along a single axis.</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
                <h4 className="font-semibold text-zinc-200 mb-1">Rotation Handle</h4>
                <p>Drag the circular stem extending above the top edge to rotate the shape 360 degrees around its center.</p>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'layers' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest">Organization</span>
              <h1 className="text-2xl font-bold text-white mt-1 mb-3">Categorized Layer System</h1>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed">
              The Left Sidebar features an automatic shape categorizer that groups all canvas objects by type:
            </p>
            <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/60 space-y-3 text-xs text-zinc-300">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                <span className="font-semibold">Frames & Artboards</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                <span className="font-semibold">Rectangles & Surfaces</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="font-semibold">Text Elements</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-semibold">Arrows & Lines</span>
              </div>
            </div>
          </div>
        )}
        {activeSection === 'templates' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest">Library</span>
              <h1 className="text-2xl font-bold text-white mt-1 mb-3">Design Templates</h1>
              <p className="text-sm text-zinc-400">
                Choose from 10 pre-built layout types available directly in the sidebar or via the Insert Template modal.
              </p>
            </div>
          </div>
        )}
        {activeSection === 'shortcuts' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest">Reference</span>
              <h1 className="text-2xl font-bold text-white mt-1 mb-3">Keyboard Shortcuts</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {[
                { key: 'V', action: 'Select Mode' },
                { key: 'H / Space', action: 'Hand / Pan Canvas' },
                { key: 'R', action: 'Rectangle Tool' },
                { key: 'O', action: 'Ellipse Tool' },
                { key: 'L', action: 'Line Tool' },
                { key: 'T', action: 'Text Tool' },
                { key: 'F', action: 'Frame Tool' },
                { key: 'Ctrl + D', action: 'Duplicate Selected' },
                { key: 'Delete', action: 'Remove Selected' },
                { key: 'Ctrl + A', action: 'Select All Shapes' },
                { key: 'Shift + ?', action: 'Shortcuts Modal' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/60">
                  <span className="text-zinc-300 font-medium">{s.action}</span>
                  <kbd className="px-2 py-0.5 bg-zinc-800 rounded font-mono text-[11px] text-zinc-400">{s.key}</kbd>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeSection === 'collaboration' && (
          <div className="space-y-6">
            <div>
              <span className="text-[11px] font-mono text-indigo-400 uppercase tracking-widest">Networking</span>
              <h1 className="text-2xl font-bold text-white mt-1 mb-3">Live Sync & Realtime Protocol</h1>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Flavor connects to a WebSocket server (`ws://localhost:3001`) with automatic heartbeat pings every 15 seconds and reconnect polling.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
