import { create } from 'zustand';
import { Shape, ShapeType } from '@figma-clone/shared';
export type ToolType =
  | 'select'
  | 'hand'
  | 'rectangle'
  | 'ellipse'
  | 'line'
  | 'arrow'
  | 'text'
  | 'frame'
  | 'polygon'
  | 'star';
interface ShapesState {
  shapes: Shape[];
  selectedIds: Set<string>;
  hoveredId: string | null;
  activeTool: ToolType;
  setShapes: (shapes: Shape[]) => void;
  addShape: (shape: Shape) => void;
  updateShape: (id: string, partial: Partial<Shape>) => void;
  deleteShapes: (ids: string[]) => void;
  duplicateShapes: (ids: string[]) => void;
  selectShape: (id: string) => void;
  addToSelection: (id: string) => void;
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  selectShapes: (ids: string[]) => void;
  setHoveredId: (id: string | null) => void;
  setActiveTool: (tool: ToolType) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;
  groupShapes: (ids: string[]) => void;
  ungroupShapes: (ids: string[]) => void;
  past: Shape[][];
  future: Shape[][];
  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  alignSelected: (alignment: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
}
export const useShapesStore = create<ShapesState>((set, get) => ({
  shapes: [],
  selectedIds: new Set<string>(),
  hoveredId: null,
  activeTool: 'select',
  past: [],
  future: [],
  pushHistory: () =>
    set((state) => ({
      past: [...state.past.slice(-49), state.shapes],
      future: [],
    })),
  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;
      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);
      return {
        shapes: previous,
        past: newPast,
        future: [state.shapes, ...state.future],
      };
    }),
  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      return {
        shapes: next,
        past: [...state.past, state.shapes],
        future: newFuture,
      };
    }),
  alignSelected: (alignment) =>
    set((state) => {
      const ids = Array.from(state.selectedIds);
      if (ids.length < 2) return state;
      const targetShapes = state.shapes.filter((s) => ids.includes(s.id));
      
      let newShapes = [...state.shapes];
      const newPast = [...state.past.slice(-49), state.shapes];
      
      if (alignment === 'left') {
        const minX = Math.min(...targetShapes.map((s) => s.x));
        newShapes = state.shapes.map((s) =>
          ids.includes(s.id) ? { ...s, x: minX } as Shape : s
        );
      } else if (alignment === 'right') {
        const maxX = Math.max(...targetShapes.map((s) => s.x + s.width));
        newShapes = state.shapes.map((s) =>
          ids.includes(s.id) ? { ...s, x: maxX - s.width } as Shape : s
        );
      } else if (alignment === 'center') {
        const centers = targetShapes.map((s) => s.x + s.width / 2);
        const avgCenter = centers.reduce((a, b) => a + b, 0) / centers.length;
        newShapes = state.shapes.map((s) =>
          ids.includes(s.id) ? { ...s, x: avgCenter - s.width / 2 } as Shape : s
        );
      } else if (alignment === 'top') {
        const minY = Math.min(...targetShapes.map((s) => s.y));
        newShapes = state.shapes.map((s) =>
          ids.includes(s.id) ? { ...s, y: minY } as Shape : s
        );
      } else if (alignment === 'bottom') {
        const maxY = Math.max(...targetShapes.map((s) => s.y + s.height));
        newShapes = state.shapes.map((s) =>
          ids.includes(s.id) ? { ...s, y: maxY - s.height } as Shape : s
        );
      } else if (alignment === 'middle') {
        const middles = targetShapes.map((s) => s.y + s.height / 2);
        const avgMiddle = middles.reduce((a, b) => a + b, 0) / middles.length;
        newShapes = state.shapes.map((s) =>
          ids.includes(s.id) ? { ...s, y: avgMiddle - s.height / 2 } as Shape : s
        );
      }
      
      return {
        shapes: newShapes,
        past: newPast,
        future: [],
      };
    }),
  setShapes: (shapes) => set({ shapes, selectedIds: new Set() }),
  addShape: (shape) =>
    set((state) => ({ shapes: [...state.shapes, shape] })),
  updateShape: (id, partial) =>
    set((state) => ({
      shapes: state.shapes.map((s) =>
        s.id === id ? ({ ...s, ...partial } as Shape) : s
      ),
    })),
  deleteShapes: (ids) =>
    set((state) => {
      const idSet = new Set(ids);
      const newSelected = new Set(state.selectedIds);
      ids.forEach((id) => newSelected.delete(id));
      return {
        shapes: state.shapes.filter((s) => !idSet.has(s.id)),
        selectedIds: newSelected,
      };
    }),
  duplicateShapes: (ids) =>
    set((state) => {
      const maxZ = state.shapes.reduce((max, s) => Math.max(max, s.zIndex), 0);
      const duplicates: Shape[] = [];
      let zOffset = 1;
      ids.forEach((id) => {
        const original = state.shapes.find((s) => s.id === id);
        if (original) {
          duplicates.push({
            ...original,
            id: `shape_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            name: `${original.name} copy`,
            x: original.x + 20,
            y: original.y + 20,
            zIndex: maxZ + zOffset,
          } as Shape);
          zOffset++;
        }
      });
      return { shapes: [...state.shapes, ...duplicates] };
    }),
  selectShape: (id) =>
    set(() => ({ selectedIds: new Set([id]) })),
  addToSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      next.add(id);
      return { selectedIds: next };
    }),
  toggleSelection: (id) =>
    set((state) => {
      const next = new Set(state.selectedIds);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { selectedIds: next };
    }),
  selectAll: () =>
    set((state) => ({
      selectedIds: new Set(state.shapes.filter((s) => !s.locked).map((s) => s.id)),
    })),
  clearSelection: () =>
    set(() => ({ selectedIds: new Set<string>() })),
  selectShapes: (ids) =>
    set(() => ({ selectedIds: new Set(ids) })),
  setHoveredId: (id) => set(() => ({ hoveredId: id })),
  setActiveTool: (tool) => set(() => ({ activeTool: tool })),
  bringToFront: (id: string) =>
    set((state) => {
      const maxZ = state.shapes.reduce((max, s) => Math.max(max, s.zIndex), 0);
      return {
        shapes: state.shapes.map((s) =>
          s.id === id ? ({ ...s, zIndex: maxZ + 1 } as Shape) : s
        ),
      };
    }),
  sendToBack: (id: string) =>
    set((state) => {
      const minZ = state.shapes.reduce((min, s) => Math.min(min, s.zIndex), Infinity);
      return {
        shapes: state.shapes.map((s) =>
          s.id === id ? ({ ...s, zIndex: minZ - 1 } as Shape) : s
        ),
      };
    }),
  groupShapes: (ids: string[]) =>
    set((state) => {
      if (ids.length < 2) return state;
      const targetShapes = state.shapes.filter((s) => ids.includes(s.id));
      const minX = Math.min(...targetShapes.map((s) => s.x));
      const minY = Math.min(...targetShapes.map((s) => s.y));
      const maxX = Math.max(...targetShapes.map((s) => s.x + s.width));
      const maxY = Math.max(...targetShapes.map((s) => s.y + s.height));
      const maxZ = Math.max(...targetShapes.map((s) => s.zIndex));
      const frameId = `frame_group_${Date.now()}`;
      const groupFrame: Shape = {
        id: frameId,
        type: ShapeType.FRAME,
        name: `Group (${ids.length})`,
        x: minX - 10,
        y: minY - 10,
        width: maxX - minX + 20,
        height: maxY - minY + 20,
        rotation: 0,
        opacity: 1,
        visible: true,
        locked: false,
        zIndex: maxZ + 1,
        fill: { color: 'transparent', opacity: 0 },
        stroke: { color: '#6366f1', width: 1, opacity: 0.5 },
        childrenIds: ids,
      };
      return {
        shapes: [...state.shapes, groupFrame],
        selectedIds: new Set([frameId]),
      };
    }),
  ungroupShapes: (ids: string[]) =>
    set((state) => {
      const framesToRemove = new Set(ids);
      const remaining = state.shapes.filter((s) => !framesToRemove.has(s.id) || s.type !== ShapeType.FRAME);
      return {
        shapes: remaining,
        selectedIds: new Set(),
      };
    }),
}));
