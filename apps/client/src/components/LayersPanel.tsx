import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useShapesStore } from '../store/useShapesStore';
import {
  Eye, EyeOff, Lock, Unlock, Trash2,
  ChevronDown, ChevronRight, Pencil, Copy,
  ArrowUp, ArrowDown,
  Square, Circle, Minus, ArrowRight, Type,
  Box, Pentagon, Star, Spline,
} from 'lucide-react';
import { Shape, ShapeType } from '@figma-clone/shared';
const SHAPE_TYPE_META: Record<ShapeType, { label: string; icon: React.ReactNode; color: string }> = {
  [ShapeType.RECTANGLE]: { label: 'Rectangles', icon: <Square className="w-3.5 h-3.5" />, color: 'text-blue-400' },
  [ShapeType.ELLIPSE]: { label: 'Ellipses', icon: <Circle className="w-3.5 h-3.5" />, color: 'text-purple-400' },
  [ShapeType.LINE]: { label: 'Lines', icon: <Minus className="w-3.5 h-3.5" />, color: 'text-zinc-400' },
  [ShapeType.ARROW]: { label: 'Arrows', icon: <ArrowRight className="w-3.5 h-3.5" />, color: 'text-amber-400' },
  [ShapeType.TEXT]: { label: 'Text Layers', icon: <Type className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
  [ShapeType.FRAME]: { label: 'Frames', icon: <Box className="w-3.5 h-3.5" />, color: 'text-indigo-400' },
  [ShapeType.POLYGON]: { label: 'Polygons', icon: <Pentagon className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  [ShapeType.STAR]: { label: 'Stars', icon: <Star className="w-3.5 h-3.5" />, color: 'text-yellow-400' },
  [ShapeType.BEZIER_PATH]: { label: 'Paths', icon: <Spline className="w-3.5 h-3.5" />, color: 'text-rose-400' },
};
const CATEGORY_ORDER: ShapeType[] = [
  ShapeType.FRAME,
  ShapeType.RECTANGLE,
  ShapeType.ELLIPSE,
  ShapeType.TEXT,
  ShapeType.LINE,
  ShapeType.ARROW,
  ShapeType.POLYGON,
  ShapeType.STAR,
  ShapeType.BEZIER_PATH,
];
interface ContextMenuState {
  x: number;
  y: number;
  shape: Shape;
}
export const LayersPanel: React.FC = () => {
  const {
    shapes, selectedIds, selectShape, addToSelection, updateShape, deleteShapes,
    duplicateShapes, bringToFront, sendToBack,
  } = useShapesStore();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<ShapeType>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);
  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);
  const grouped = useMemo(() => {
    const map = new Map<ShapeType, Shape[]>();
    const sorted = [...shapes].sort((a, b) => b.zIndex - a.zIndex);
    sorted.forEach((s) => {
      if (!map.has(s.type)) map.set(s.type, []);
      map.get(s.type)!.push(s);
    });
    return map;
  }, [shapes]);
  const toggleGroup = (type: ShapeType) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };
  const handleStartRename = (shape: Shape) => {
    setEditingId(shape.id);
    setEditingName(shape.name);
    setContextMenu(null);
  };
  const handleSaveRename = () => {
    if (editingId && editingName.trim()) {
      updateShape(editingId, { name: editingName.trim() });
    }
    setEditingId(null);
  };
  const handleContextMenu = (e: React.MouseEvent, shape: Shape) => {
    e.preventDefault();
    e.stopPropagation();
    selectShape(shape.id);
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      shape,
    });
  };
  const activeCategories = CATEGORY_ORDER.filter((t) => grouped.has(t));
  return (
    <div className="flex flex-col h-full relative">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-[10px] uppercase tracking-[0.15em] text-zinc-600 font-bold">
          Layers
        </h2>
        <span className="text-[10px] font-mono text-zinc-700 tabular-nums">{shapes.length}</span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-1">
        {shapes.length === 0 && (
          <div className="text-[11px] text-zinc-700 italic px-2 py-6 text-center leading-relaxed">
            Empty canvas.<br />
            <span className="text-zinc-600">Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[9px] font-mono mx-0.5">R</kbd> to draw a rectangle.</span>
          </div>
        )}
        {activeCategories.map((type) => {
          const meta = SHAPE_TYPE_META[type];
          const items = grouped.get(type) || [];
          const isCollapsed = collapsedGroups.has(type);
          const selectedInGroup = items.filter((s) => selectedIds.has(s.id)).length;
          return (
            <div key={type}>
              <button
                onClick={() => toggleGroup(type)}
                className="w-full flex items-center space-x-1.5 px-1.5 py-[5px] rounded-lg text-[10px] font-semibold uppercase tracking-wider hover:bg-zinc-800/30 transition-colors group"
              >
                {isCollapsed
                  ? <ChevronRight className="w-3 h-3 text-zinc-700" />
                  : <ChevronDown className="w-3 h-3 text-zinc-700" />
                }
                <span className={meta.color}>{meta.icon}</span>
                <span className="text-zinc-500 group-hover:text-zinc-300 transition-colors flex-1 text-left">
                  {meta.label}
                </span>
                <span className="text-[9px] font-mono text-zinc-700 tabular-nums">
                  {selectedInGroup > 0 && (
                    <span className="text-indigo-400 mr-1">{selectedInGroup}/</span>
                  )}
                  {items.length}
                </span>
              </button>
              {!isCollapsed && (
                <div className="pl-3 space-y-px mb-1">
                  {items.map((shape) => {
                    const isSelected = selectedIds.has(shape.id);
                    const isEditing = editingId === shape.id;
                    return (
                      <div
                        key={shape.id}
                        onClick={(e) => {
                          if (e.shiftKey) addToSelection(shape.id);
                          else selectShape(shape.id);
                        }}
                        onDoubleClick={() => handleStartRename(shape)}
                        onContextMenu={(e) => handleContextMenu(e, shape)}
                        className={`flex items-center space-x-2 px-2 py-[5px] rounded-lg cursor-pointer text-[11px] transition-all duration-100 group/item ${
                          isSelected
                            ? 'bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-500/25 font-medium'
                            : 'hover:bg-zinc-800/40 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <span className={`w-3.5 shrink-0 ${meta.color} opacity-60`}>
                          {meta.icon}
                        </span>
                        {isEditing ? (
                          <input
                            ref={inputRef}
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={handleSaveRename}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 bg-zinc-900 border border-indigo-500/40 px-1 py-0.5 rounded text-[11px] text-zinc-100 outline-none"
                          />
                        ) : (
                          <span
                            className={`flex-1 truncate ${!shape.visible ? 'opacity-30 line-through' : ''} ${shape.locked ? 'opacity-50' : ''}`}
                          >
                            {shape.name}
                          </span>
                        )}
                        <div className="flex items-center space-x-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-100">
                          <button
                            onClick={(e) => { e.stopPropagation(); updateShape(shape.id, { visible: !shape.visible }); }}
                            className="p-0.5 hover:text-zinc-200 transition-colors"
                            title={shape.visible ? 'Hide' : 'Show'}
                          >
                            {shape.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateShape(shape.id, { locked: !shape.locked }); }}
                            className="p-0.5 hover:text-zinc-200 transition-colors"
                            title={shape.locked ? 'Unlock' : 'Lock'}
                          >
                            {shape.locked ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteShapes([shape.id]); }}
                            className="p-0.5 hover:text-rose-400 transition-colors"
                            title="Delete Layer"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {contextMenu && (
        <div
          style={{ top: Math.min(contextMenu.y, window.innerHeight - 220), left: contextMenu.x }}
          className="fixed z-50 w-48 bg-[#0e0e11] border border-zinc-800/80 rounded-xl shadow-2xl shadow-black/80 py-1.5 text-[11px] animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-600 border-b border-zinc-800/40 mb-1">
            {contextMenu.shape.name}
          </div>
          <button
            onClick={() => handleStartRename(contextMenu.shape)}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rename</span>
          </button>
          <button
            onClick={() => { duplicateShapes([contextMenu.shape.id]); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            <Copy className="w-3.5 h-3.5 text-cyan-400" />
            <span>Duplicate</span>
            <span className="ml-auto text-[9px] font-mono text-zinc-600">Ctrl+D</span>
          </button>
          <div className="h-px bg-zinc-800/50 my-1" />
          <button
            onClick={() => { bringToFront(contextMenu.shape.id); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 text-zinc-400" />
            <span>Bring to Front</span>
          </button>
          <button
            onClick={() => { sendToBack(contextMenu.shape.id); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            <ArrowDown className="w-3.5 h-3.5 text-zinc-400" />
            <span>Send to Back</span>
          </button>
          <div className="h-px bg-zinc-800/50 my-1" />
          <button
            onClick={() => { updateShape(contextMenu.shape.id, { locked: !contextMenu.shape.locked }); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            {contextMenu.shape.locked ? <Unlock className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>{contextMenu.shape.locked ? 'Unlock Layer' : 'Lock Layer'}</span>
          </button>
          <button
            onClick={() => { updateShape(contextMenu.shape.id, { visible: !contextMenu.shape.visible }); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            {contextMenu.shape.visible ? <EyeOff className="w-3.5 h-3.5 text-zinc-400" /> : <Eye className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{contextMenu.shape.visible ? 'Hide Layer' : 'Show Layer'}</span>
          </button>
          <div className="h-px bg-zinc-800/50 my-1" />
          <button
            onClick={() => { deleteShapes([contextMenu.shape.id]); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Layer</span>
            <span className="ml-auto text-[9px] font-mono text-zinc-600">Del</span>
          </button>
        </div>
      )}
    </div>
  );
};
