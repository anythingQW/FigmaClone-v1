import { create } from 'zustand';
import { Camera, Viewport, GridConfig, Point, CANVAS_DEFAULTS } from '@figma-clone/shared';
import { CameraSystem } from '../canvas/Camera';
interface CanvasState {
  camera: Camera;
  viewport: Viewport;
  grid: GridConfig;
  isPanning: boolean;
  isPreviewMode: boolean;
  setViewport: (width: number, height: number) => void;
  setCamera: (camera: Partial<Camera>) => void;
  zoomAt: (screenPoint: Point, deltaZoom: number) => void;
  panBy: (dx: number, dy: number) => void;
  resetCamera: () => void;
  setIsPanning: (isPanning: boolean) => void;
  toggleGrid: () => void;
  setIsPreviewMode: (isPreviewMode: boolean) => void;
}
export const useCanvasStore = create<CanvasState>((set, get) => ({
  camera: {
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    zoom: CANVAS_DEFAULTS.DEFAULT_ZOOM,
  },
  viewport: {
    width: typeof window !== 'undefined' ? window.innerWidth : 1000,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  },
  grid: {
    enabled: true,
    size: CANVAS_DEFAULTS.GRID_SIZE,
    majorFactor: CANVAS_DEFAULTS.MAJOR_GRID_FACTOR,
    color: 'rgba(255, 255, 255, 0.05)',
    majorColor: 'rgba(255, 255, 255, 0.12)',
  },
  isPanning: false,
  isPreviewMode: false,
  setViewport: (width, height) =>
    set(() => ({ viewport: { width, height } })),
  setCamera: (partialCamera) =>
    set((state) => ({ camera: { ...state.camera, ...partialCamera } })),
  zoomAt: (screenPoint, deltaZoom) =>
    set((state) => ({
      camera: CameraSystem.zoomAtPoint(state.camera, screenPoint, deltaZoom),
    })),
  panBy: (dx, dy) =>
    set((state) => ({
      camera: CameraSystem.panBy(state.camera, dx, dy),
    })),
  resetCamera: () =>
    set((state) => ({
      camera: {
        x: state.viewport.width / 2,
        y: state.viewport.height / 2,
        zoom: 1,
      },
    })),
  setIsPanning: (isPanning) => set({ isPanning }),
  toggleGrid: () =>
    set((state) => ({
      grid: { ...state.grid, enabled: !state.grid.enabled },
    })),
  setIsPreviewMode: (isPreviewMode) => set({ isPreviewMode }),
}));
