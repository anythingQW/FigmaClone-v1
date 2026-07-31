import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
import { useShapesStore, ToolType } from '../store/useShapesStore';
import { GridRenderer } from '../canvas/GridRenderer';
import { ShapeRenderer } from '../canvas/ShapeRenderer';
import { ShapeFactory } from '../canvas/ShapeFactory';
import { HitTest } from '../canvas/HitTest';
import { CameraSystem } from '../canvas/Camera';
import { TransformSystem, HandleType } from '../canvas/Transform';
import {
  Pencil, Copy, ArrowUp, ArrowDown, Lock, Unlock,
  Eye, EyeOff, Trash2,
} from 'lucide-react';
import { Shape } from '@figma-clone/shared';
interface DragState {
  type: 'none' | 'creating' | 'moving' | 'resizing' | 'rotating' | 'marquee' | 'panning';
  startScreenX: number;
  startScreenY: number;
  startWorldX: number;
  startWorldY: number;
  activeHandle?: HandleType;
  initialShapeState?: any;
}
const INITIAL_DRAG: DragState = {
  type: 'none',
  startScreenX: 0,
  startScreenY: 0,
  startWorldX: 0,
  startWorldY: 0,
};
export const CanvasContainer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { camera, viewport, grid, setViewport, zoomAt, panBy, setIsPanning, isPreviewMode } = useCanvasStore();
  const {
    shapes, selectedIds, hoveredId, activeTool,
    addShape, updateShape, selectShape, addToSelection, toggleSelection,
    clearSelection, selectShapes, setHoveredId, setActiveTool,
    duplicateShapes, bringToFront, sendToBack, deleteShapes,
  } = useShapesStore();
  const [mouseWorldPos, setMouseWorldPos] = useState({ x: 0, y: 0 });
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const dragRef = useRef<DragState>(INITIAL_DRAG);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const [marqueeRect, setMarqueeRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [creatingShapePreview, setCreatingShapePreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [hoveredHandle, setHoveredHandle] = useState<HandleType | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; shape: Shape } | null>(null);
  useEffect(() => {
    const handleGlobalClick = () => setContextMenu(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          setViewport(width, height);
        }
      }
    });
    ro.observe(container);
    return () => ro.disconnect();
  }, [setViewport]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    canvas.width = Math.floor(viewport.width * dpr);
    canvas.height = Math.floor(viewport.height * dpr);
    canvas.style.width = `${viewport.width}px`;
    canvas.style.height = `${viewport.height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    GridRenderer.render(ctx, camera, viewport, isPreviewMode ? { ...grid, enabled: false } : grid);
    const sorted = [...shapes].sort((a, b) => a.zIndex - b.zIndex);
    sorted.forEach((shape) => {
      ShapeRenderer.render(
        ctx, shape, camera,
        isPreviewMode ? false : selectedIds.has(shape.id),
        isPreviewMode ? false : hoveredId === shape.id
      );
    });
    if (marqueeRect && !isPreviewMode) {
      ctx.save();
      ctx.fillStyle = 'rgba(99, 102, 241, 0.06)';
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.5)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 3]);
      ctx.fillRect(marqueeRect.x, marqueeRect.y, marqueeRect.w, marqueeRect.h);
      ctx.strokeRect(marqueeRect.x, marqueeRect.y, marqueeRect.w, marqueeRect.h);
      ctx.restore();
    }
    if (creatingShapePreview && !isPreviewMode) {
      ctx.save();
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(
        creatingShapePreview.x, creatingShapePreview.y,
        creatingShapePreview.w, creatingShapePreview.h
      );
      ctx.restore();
    }
  }, [camera, viewport, grid, shapes, selectedIds, hoveredId, marqueeRect, creatingShapePreview, isPreviewMode]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space' && !e.repeat) setIsSpacePressed(true);
      if (isPreviewMode) return;
      if (e.code === 'Delete' || e.code === 'Backspace') {
        if (selectedIds.size > 0) {
          deleteShapes([...selectedIds]);
        }
      }
      if (e.key === 'a' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        useShapesStore.getState().selectAll();
      }
      if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) useShapesStore.getState().redo();
        else useShapesStore.getState().undo();
      }
      if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        useShapesStore.getState().redo();
      }
      if (e.key === 'd' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (selectedIds.size > 0) {
          useShapesStore.getState().pushHistory();
          duplicateShapes([...selectedIds]);
        }
      }
      if (e.key === 'g' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          if (selectedIds.size > 0) {
            useShapesStore.getState().pushHistory();
            useShapesStore.getState().ungroupShapes([...selectedIds]);
          }
        } else {
          if (selectedIds.size > 1) {
            useShapesStore.getState().pushHistory();
            useShapesStore.getState().groupShapes([...selectedIds]);
          }
        }
      }
      if (e.code === 'KeyV') setActiveTool('select');
      if (e.code === 'KeyH') setActiveTool('hand');
      if (e.code === 'KeyR') setActiveTool('rectangle');
      if (e.code === 'KeyO') setActiveTool('ellipse');
      if (e.code === 'KeyL') setActiveTool('line');
      if (e.code === 'KeyT') setActiveTool('text');
      if (e.code === 'KeyF') setActiveTool('frame');
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setIsPanning, setActiveTool, selectedIds, isPreviewMode, deleteShapes, duplicateShapes]);
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      if (e.ctrlKey || e.metaKey) {
        zoomAt({ x: mouseX, y: mouseY }, e.deltaY < 0 ? 1.08 : 0.92);
      } else {
        panBy(-e.deltaX, -e.deltaY);
      }
    },
    [zoomAt, panBy]
  );
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const hit = HitTest.findShapeAtPoint(screenX, screenY, shapes, camera);
    if (hit) {
      selectShape(hit.id);
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        shape: hit,
      });
    }
  };
  const handleMouseDown = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPt = CameraSystem.screenToWorld({ x: screenX, y: screenY }, camera);
    if (e.button === 1 || (e.button === 0 && (isSpacePressed || activeTool === 'hand' || isPreviewMode))) {
      dragRef.current = { type: 'panning', startScreenX: screenX, startScreenY: screenY, startWorldX: 0, startWorldY: 0 };
      lastMousePosRef.current = { x: screenX, y: screenY };
      setIsPanning(true);
      return;
    }
    if (e.button !== 0 || isPreviewMode) return;
    const creationTools: ToolType[] = ['rectangle', 'ellipse', 'line', 'arrow', 'text', 'frame', 'polygon', 'star'];
    if (creationTools.includes(activeTool)) {
      useShapesStore.getState().pushHistory();
      dragRef.current = { type: 'creating', startScreenX: screenX, startScreenY: screenY, startWorldX: worldPt.x, startWorldY: worldPt.y };
      return;
    }
    if (activeTool === 'select') {
      if (selectedIds.size === 1) {
        const activeShapeId = Array.from(selectedIds)[0];
        const shape = shapes.find((s) => s.id === activeShapeId);
        if (shape) {
          const handleHit = TransformSystem.hitTestHandles(screenX, screenY, shape, camera);
          if (handleHit) {
            useShapesStore.getState().pushHistory();
            if (handleHit === 'rot') {
              dragRef.current = {
                type: 'rotating', startScreenX: screenX, startScreenY: screenY,
                startWorldX: worldPt.x, startWorldY: worldPt.y,
                initialShapeState: { ...shape },
              };
            } else {
              dragRef.current = {
                type: 'resizing', startScreenX: screenX, startScreenY: screenY,
                startWorldX: worldPt.x, startWorldY: worldPt.y,
                activeHandle: handleHit, initialShapeState: { ...shape },
              };
            }
            return;
          }
        }
      }
      const hit = HitTest.findShapeAtPoint(screenX, screenY, shapes, camera);
      if (hit) {
        useShapesStore.getState().pushHistory();
        if (e.shiftKey) addToSelection(hit.id);
        else if (e.ctrlKey || e.metaKey) toggleSelection(hit.id);
        else if (!selectedIds.has(hit.id)) selectShape(hit.id);
        dragRef.current = { type: 'moving', startScreenX: screenX, startScreenY: screenY, startWorldX: worldPt.x, startWorldY: worldPt.y };
      } else {
        if (!e.shiftKey && !e.ctrlKey && !e.metaKey) clearSelection();
        dragRef.current = { type: 'marquee', startScreenX: screenX, startScreenY: screenY, startWorldX: worldPt.x, startWorldY: worldPt.y };
      }
    }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPt = CameraSystem.screenToWorld({ x: screenX, y: screenY }, camera);
    setMouseWorldPos({ x: Math.round(worldPt.x), y: Math.round(worldPt.y) });
    const drag = dragRef.current;
    if (drag.type === 'panning') {
      const dx = screenX - lastMousePosRef.current.x;
      const dy = screenY - lastMousePosRef.current.y;
      panBy(dx, dy);
      lastMousePosRef.current = { x: screenX, y: screenY };
      return;
    }
    if (isPreviewMode) return;
    if (drag.type === 'creating') {
      const minSX = Math.min(drag.startScreenX, screenX);
      const minSY = Math.min(drag.startScreenY, screenY);
      const w = Math.abs(screenX - drag.startScreenX);
      const h = Math.abs(screenY - drag.startScreenY);
      setCreatingShapePreview({ x: minSX, y: minSY, w, h });
      return;
    }
    if (drag.type === 'moving') {
      const dx = (screenX - drag.startScreenX) / camera.zoom;
      const dy = (screenY - drag.startScreenY) / camera.zoom;
      selectedIds.forEach((id) => {
        const shape = shapes.find((s) => s.id === id);
        if (shape && !shape.locked) {
          updateShape(id, { x: shape.x + dx, y: shape.y + dy });
        }
      });
      dragRef.current = { ...drag, startScreenX: screenX, startScreenY: screenY };
      return;
    }
    if (drag.type === 'resizing' && drag.activeHandle && drag.initialShapeState) {
      const resized = TransformSystem.resize(
        drag.initialShapeState, drag.activeHandle,
        drag.startWorldX, drag.startWorldY, worldPt.x, worldPt.y
      );
      updateShape(drag.initialShapeState.id, resized);
      return;
    }
    if (drag.type === 'rotating' && drag.initialShapeState) {
      const angle = TransformSystem.rotate(drag.initialShapeState, camera, screenX, screenY);
      updateShape(drag.initialShapeState.id, { rotation: angle });
      return;
    }
    if (drag.type === 'marquee') {
      const x = Math.min(drag.startScreenX, screenX);
      const y = Math.min(drag.startScreenY, screenY);
      const w = Math.abs(screenX - drag.startScreenX);
      const h = Math.abs(screenY - drag.startScreenY);
      setMarqueeRect({ x, y, w, h });
      return;
    }
    if (activeTool === 'select' && drag.type === 'none') {
      if (selectedIds.size === 1) {
        const shape = shapes.find((s) => s.id === Array.from(selectedIds)[0]);
        if (shape) {
          const handleHit = TransformSystem.hitTestHandles(screenX, screenY, shape, camera);
          setHoveredHandle(handleHit);
          if (handleHit) return;
        }
      }
      setHoveredHandle(null);
      const hit = HitTest.findShapeAtPoint(screenX, screenY, shapes, camera);
      setHoveredId(hit ? hit.id : null);
    }
  };
  const handleMouseUp = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const screenX = e.clientX - rect.left;
    const screenY = e.clientY - rect.top;
    const worldPt = CameraSystem.screenToWorld({ x: screenX, y: screenY }, camera);
    const drag = dragRef.current;
    if (drag.type === 'panning') setIsPanning(false);
    if (isPreviewMode) {
      dragRef.current = INITIAL_DRAG;
      return;
    }
    if (drag.type === 'creating') {
      setCreatingShapePreview(null);
      const x = Math.min(drag.startWorldX, worldPt.x);
      const y = Math.min(drag.startWorldY, worldPt.y);
      const w = Math.max(Math.abs(worldPt.x - drag.startWorldX), 10);
      const h = Math.max(Math.abs(worldPt.y - drag.startWorldY), 10);
      const zIndex = shapes.length;
      let newShape;
      switch (activeTool) {
        case 'rectangle':
          newShape = ShapeFactory.createRectangle({ x, y, width: w, height: h, zIndex });
          break;
        case 'ellipse':
          newShape = ShapeFactory.createEllipse({ x, y, width: w, height: h, zIndex });
          break;
        case 'line':
          newShape = ShapeFactory.createLine({ x: drag.startWorldX, y: drag.startWorldY, x2: worldPt.x, y2: worldPt.y, width: w, height: h, zIndex });
          break;
        case 'arrow':
          newShape = ShapeFactory.createArrow({ x: drag.startWorldX, y: drag.startWorldY, x2: worldPt.x, y2: worldPt.y, width: w, height: h, zIndex });
          break;
        case 'text':
          newShape = ShapeFactory.createText({ x, y, width: w, height: h, zIndex });
          break;
        case 'frame':
          newShape = ShapeFactory.createFrame({ x, y, width: w, height: h, zIndex });
          break;
        case 'polygon':
          newShape = ShapeFactory.createPolygon({ x, y, width: w, height: h, zIndex });
          break;
        case 'star':
          newShape = ShapeFactory.createStar({ x, y, width: w, height: h, zIndex });
          break;
      }
      if (newShape) {
        addShape(newShape);
        selectShape(newShape.id);
        setActiveTool('select');
      }
    }
    if (drag.type === 'marquee' && marqueeRect) {
      const found = HitTest.findShapesInRect(
        marqueeRect.x, marqueeRect.y,
        marqueeRect.x + marqueeRect.w, marqueeRect.y + marqueeRect.h,
        shapes, camera
      );
      if (found.length > 0) selectShapes(found.map((s) => s.id));
      setMarqueeRect(null);
    }
    dragRef.current = INITIAL_DRAG;
  };
  const getCursor = (): string => {
    if (isSpacePressed || activeTool === 'hand' || isPreviewMode) return 'grab';
    if (dragRef.current.type === 'panning') return 'grabbing';
    if (activeTool === 'select') {
      if (hoveredHandle) {
        if (hoveredHandle === 'rot') return 'crosshair';
        if (['tl', 'br'].includes(hoveredHandle)) return 'nwse-resize';
        if (['tr', 'bl'].includes(hoveredHandle)) return 'nesw-resize';
        if (['tc', 'bc'].includes(hoveredHandle)) return 'ns-resize';
        if (['ml', 'mr'].includes(hoveredHandle)) return 'ew-resize';
      }
      if (hoveredId) return 'move';
      return 'default';
    }
    if (activeTool === 'text') return 'text';
    return 'crosshair';
  };
  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onContextMenu={handleContextMenu}
      style={{ cursor: getCursor() }}
      className="relative w-full h-full bg-[#0a0a0c] overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
      />
      <div className="absolute bottom-3 left-3 glass-panel px-3 py-1.5 rounded-lg text-[10px] font-mono flex items-center space-x-2.5 pointer-events-none z-10 animate-fade-in">
        <span className="text-zinc-500">
          <span className="text-zinc-400">{mouseWorldPos.x}</span>
          <span className="text-zinc-700 mx-1">×</span>
          <span className="text-zinc-400">{mouseWorldPos.y}</span>
        </span>
        <span className="w-px h-3 bg-zinc-800" />
        <span className="text-indigo-400 font-semibold tabular-nums">
          {Math.round(camera.zoom * 100)}%
        </span>
        <span className="w-px h-3 bg-zinc-800" />
        <span className="text-zinc-600">
          {shapes.length} obj · {selectedIds.size} sel
        </span>
      </div>
      {contextMenu && (
        <div
          style={{ top: contextMenu.y, left: contextMenu.x }}
          className="fixed z-50 w-48 bg-[#0e0e11] border border-zinc-800/80 rounded-xl shadow-2xl shadow-black/80 py-1.5 text-[11px] animate-modal-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-600 border-b border-zinc-800/40 mb-1">
            {contextMenu.shape.name}
          </div>
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
            className="w-full flex items-center space-x-2 px-3 py-2 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            {contextMenu.shape.locked ? <Unlock className="w-3.5 h-3.5 text-amber-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
            <span>{contextMenu.shape.locked ? 'Unlock Shape' : 'Lock Shape'}</span>
          </button>
          <button
            onClick={() => { updateShape(contextMenu.shape.id, { visible: !contextMenu.shape.visible }); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-zinc-300 hover:bg-zinc-800/60 transition-colors"
          >
            {contextMenu.shape.visible ? <EyeOff className="w-3.5 h-3.5 text-zinc-400" /> : <Eye className="w-3.5 h-3.5 text-zinc-400" />}
            <span>{contextMenu.shape.visible ? 'Hide Shape' : 'Show Shape'}</span>
          </button>
          <div className="h-px bg-zinc-800/50 my-1" />
          <button
            onClick={() => { deleteShapes([contextMenu.shape.id]); setContextMenu(null); }}
            className="w-full flex items-center space-x-2 px-3 py-1.5 text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Shape</span>
            <span className="ml-auto text-[9px] font-mono text-zinc-600">Del</span>
          </button>
        </div>
      )}
    </div>
  );
};
