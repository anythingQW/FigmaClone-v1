import React, { useEffect, useState, useRef } from 'react';
import { RealtimeClient } from '../websocket/client';
import { MessageType, ProtocolMessage, UserPresence } from '@figma-clone/shared';
import { CanvasContainer } from '../components/CanvasContainer';
import { Toolbar } from '../components/Toolbar';
import { Minimap } from '../components/Minimap';
import { LeftPanel } from '../components/LeftPanel';
import { PropertiesPanel } from '../components/PropertiesPanel';
import { WelcomeModal } from '../components/WelcomeModal';
import { ShortcutsGuide } from '../components/ShortcutsGuide';
import { useShapesStore } from '../store/useShapesStore';
import {
  ChevronLeft, Wifi, WifiOff, Keyboard, LayoutTemplate,
  Users, Share, Download, FileJson, Image, Check, HelpCircle
} from 'lucide-react';
const wsUrl = typeof window !== 'undefined' ? `ws://${window.location.host}` : 'ws://localhost:8080';
const wsClient = new RealtimeClient(wsUrl);
interface EditorPageProps {
  projectId: string;
  onBack: () => void;
}
export const EditorPage: React.FC<EditorPageProps> = ({ projectId, onBack }) => {
  const [connected, setConnected] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [users, setUsers] = useState<UserPresence[]>([]);
  const [userId, setUserId] = useState<string>('');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showCollabMenu, setShowCollabMenu] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const { shapes, setShapes } = useShapesStore();
  const lastSentShapesRef = useRef<string>('');
  useEffect(() => {
    const saved = localStorage.getItem(`shapes_${projectId}`);
    if (saved) {
      try {
        const loaded = JSON.parse(saved);
        setShapes(loaded);
        lastSentShapesRef.current = JSON.stringify(loaded);
      } catch {
        setShapes([]);
      }
    } else {
      setShapes([]);
    }
  }, [projectId, setShapes]);
  useEffect(() => {
    const unsub = useShapesStore.subscribe((state) => {
      const serialized = JSON.stringify(state.shapes);
      localStorage.setItem(`shapes_${projectId}`, serialized);
      if (connected && serialized !== lastSentShapesRef.current) {
        lastSentShapesRef.current = serialized;
        wsClient.send({
          type: MessageType.DOCUMENT_UPDATE,
          timestamp: Date.now(),
          payload: { shapes: state.shapes }
        });
      }
    });
    return () => unsub();
  }, [projectId, connected]);
  useEffect(() => {
    wsClient.connect();
    const unsubscribe = wsClient.subscribe((msg: ProtocolMessage) => {
      if (msg.type === MessageType.INIT_SESSION) {
        setConnected(true);
        setUserId(msg.payload.userId);
        setUsers(msg.payload.users);
      } else if (msg.type === MessageType.DOCUMENT_UPDATE) {
        const remoteShapes = msg.payload.shapes;
        const serialized = JSON.stringify(remoteShapes);
        if (serialized !== lastSentShapesRef.current) {
          lastSentShapesRef.current = serialized;
          setShapes(remoteShapes);
        }
      }
    });
    return () => unsubscribe();
  }, [setShapes]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && e.shiftKey) setShowShortcuts((p) => !p);
      if (e.key === 'Escape') {
        setShowTemplates(false);
        setShowShortcuts(false);
        setShowExportMenu(false);
        setShowCollabMenu(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  const handleShare = () => {
    const shareUrl = `${window.location.origin}/?project=${projectId}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    });
  };
  const handleExport = (format: 'json' | 'png' | 'svg') => {
    if (format === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(shapes, null, 2));
      const dlAnchor = document.createElement('a');
      dlAnchor.setAttribute("href", dataStr);
      dlAnchor.setAttribute("download", `flavor-project-${projectId}.json`);
      dlAnchor.click();
    } else if (format === 'png') {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL("image/png");
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", url);
        dlAnchor.setAttribute("download", `flavor-canvas-${projectId}.png`);
        dlAnchor.click();
      }
    } else if (format === 'svg') {
      if (shapes.length > 0) {
        const minX = Math.min(...shapes.map(s => s.x));
        const minY = Math.min(...shapes.map(s => s.y));
        const maxX = Math.max(...shapes.map(s => s.x + s.width));
        const maxY = Math.max(...shapes.map(s => s.y + s.height));
        const width = Math.max(maxX - minX + 40, 100);
        const height = Math.max(maxY - minY + 40, 100);

        let svgContent = `<svg width="${width}" height="${height}" viewBox="${minX - 20} ${minY - 20} ${width} ${height}" xmlns="http://www.w3.org/2000/svg" style="background: #1e1e1e;">\n`;

        shapes.forEach(shape => {
          if (!shape.visible) return;
          const rotationStr = shape.rotation ? ` transform="rotate(${shape.rotation} ${shape.x + shape.width/2} ${shape.y + shape.height/2})"` : '';
          const fillStr = shape.fill ? ` fill="${shape.fill.color}" fill-opacity="${shape.fill.opacity}"` : ' fill="none"';
          const strokeStr = shape.stroke ? ` stroke="${shape.stroke.color}" stroke-width="${shape.stroke.width}" stroke-opacity="${shape.stroke.opacity}"` : '';

          if (shape.type === 'RECTANGLE') {
            const rx = (shape as any).cornerRadius ? ` rx="${(shape as any).cornerRadius}"` : '';
            svgContent += `  <rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}"${rx}${fillStr}${strokeStr}${rotationStr} />\n`;
          } else if (shape.type === 'ELLIPSE') {
            svgContent += `  <ellipse cx="${shape.x + shape.width/2}" cy="${shape.y + shape.height/2}" rx="${shape.width/2}" ry="${shape.height/2}"${fillStr}${strokeStr}${rotationStr} />\n`;
          } else if (shape.type === 'LINE') {
            svgContent += `  <line x1="${shape.x}" y1="${shape.y}" x2="${(shape as any).x2}" y2="${(shape as any).y2}"${strokeStr}${rotationStr} />\n`;
          } else if (shape.type === 'TEXT') {
            const anchor = (shape as any).textAlign === 'center' ? 'middle' : (shape as any).textAlign === 'right' ? 'end' : 'start';
            const textX = (shape as any).textAlign === 'center' ? shape.x + shape.width/2 : (shape as any).textAlign === 'right' ? shape.x + shape.width : shape.x;
            const weight = (shape as any).fontWeight ? ` font-weight="${(shape as any).fontWeight}"` : '';
            svgContent += `  <text x="${textX}" y="${shape.y + 16}" font-family="${(shape as any).fontFamily || 'Inter'}" font-size="${(shape as any).fontSize || 16}"${weight} text-anchor="${anchor}"${fillStr}${rotationStr}>${(shape as any).content}</text>\n`;
          } else {
            svgContent += `  <rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}"${fillStr}${strokeStr}${rotationStr} />\n`;
          }
        });

        svgContent += '</svg>';
        const dataStr = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgContent);
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute("href", dataStr);
        dlAnchor.setAttribute("download", `flavor-project-${projectId}.svg`);
        dlAnchor.click();
      }
    }
    setShowExportMenu(false);
  };
  return (
    <div className="flex flex-col h-screen w-screen bg-[var(--surface-2)] text-[var(--text-primary)] overflow-hidden select-none">
      <header className="h-11 border-b border-[var(--border-subtle)] glass-panel px-3 flex items-center justify-between z-30 shrink-0">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-all text-[12px]"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Projects</span>
          </button>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-[12px] font-semibold text-zinc-300 truncate max-w-[200px]">
            Project Workbench
          </span>
        </div>
        <div className="flex items-center space-x-1.5 relative">
          <button
            onClick={() => setShowTemplates(true)}
            title="Templates"
            className="p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <LayoutTemplate className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowShortcuts(true)}
            title="Shortcuts (Shift + ?)"
            className="p-1.5 rounded-lg hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Keyboard className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-zinc-800 mx-1" />
          <div className="relative">
            <button
               onClick={() => { setShowCollabMenu(!showCollabMenu); setShowExportMenu(false); }}
              className={`p-1.5 rounded-lg transition-colors ${showCollabMenu ? 'bg-zinc-800 text-indigo-400' : 'hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300'}`}
              title="Collaborators"
            >
              <Users className="w-4 h-4" />
            </button>
            {showCollabMenu && (
              <div className="absolute right-0 mt-1.5 w-52 bg-zinc-950 border border-zinc-800/80 rounded-xl shadow-2xl p-2 z-55">
                <p className="text-[10px] font-bold text-zinc-500 px-2 py-1 uppercase tracking-wider">Active Users ({users.length})</p>
                <div className="space-y-0.5 max-h-48 overflow-y-auto">
                  {users.map((u) => (
                    <div key={u.userId} className="flex items-center space-x-2 px-2 py-1.5 hover:bg-zinc-900 rounded-lg">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: u.color || '#6366f1' }} />
                      <span className="text-[11px] text-zinc-300 flex-1 truncate">{u.name}</span>
                      {u.userId === userId && <span className="text-[8px] text-zinc-600 bg-zinc-900 px-1 py-0.5 rounded">You</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleShare}
            className={`p-1.5 rounded-lg transition-colors relative ${copiedShare ? 'text-emerald-400 bg-emerald-500/10' : 'hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300'}`}
            title="Share Project"
          >
            {copiedShare ? <Check className="w-4 h-4" /> : <Share className="w-4 h-4" />}
            {copiedShare && (
              <div className="absolute right-0 top-8 bg-zinc-900 text-zinc-200 text-[10px] py-1 px-2.5 rounded-lg border border-zinc-800 shadow-xl whitespace-nowrap">
                Link copied!
              </div>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => { setShowExportMenu(!showExportMenu); setShowCollabMenu(false); }}
              className={`p-1.5 rounded-lg transition-colors ${showExportMenu ? 'bg-zinc-800 text-indigo-400' : 'hover:bg-zinc-800/60 text-zinc-500 hover:text-zinc-300'}`}
              title="Export Canvas"
            >
              <Download className="w-4 h-4" />
            </button>
            {showExportMenu && (
              <div className="absolute right-0 mt-1.5 w-44 bg-zinc-950 border border-zinc-800/80 rounded-xl shadow-2xl py-1 z-55">
                <button
                  onClick={() => handleExport('json')}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-900 transition-colors"
                >
                  <FileJson className="w-3.5 h-3.5 text-amber-500" />
                  <span>Download JSON</span>
                </button>
                <button
                  onClick={() => handleExport('png')}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-900 transition-colors"
                >
                  <Image className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Export as PNG</span>
                </button>
                <button
                  onClick={() => handleExport('svg')}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-900 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 text-emerald-500">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <path d="M9 15h1.5a1.5 1.5 0 0 0 0-3H9v6" />
                    <path d="M17 12H15v6h2" />
                  </svg>
                  <span>Export as SVG</span>
                </button>
              </div>
            )}
          </div>
          <div className="h-4 w-px bg-zinc-800 mx-1" />
          <div className="flex items-center space-x-1.5 px-2.5 py-1 glass-panel rounded-full text-[10px]">
            {connected ? (
              <>
                <div className="relative">
                  <Wifi className="w-3 h-3 text-emerald-400" />
                  <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <span className="text-zinc-400 font-medium">Live</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 text-rose-400" />
                <span className="text-zinc-500">Offline</span>
              </>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden relative">
        <aside className="w-52 border-r border-[var(--border-subtle)] glass-panel p-2.5 flex flex-col z-10 shrink-0">
          <LeftPanel />
        </aside>
        <section className="flex-1 relative">
          <CanvasContainer />
          <Toolbar />
          <Minimap />
        </section>
        <aside className="w-56 border-l border-[var(--border-subtle)] glass-panel p-3 flex flex-col z-10 shrink-0 overflow-y-auto">
          <PropertiesPanel />
        </aside>
      </main>
      <WelcomeModal isOpen={showTemplates} onClose={() => setShowTemplates(false)} />
      <ShortcutsGuide isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </div>
  );
};
