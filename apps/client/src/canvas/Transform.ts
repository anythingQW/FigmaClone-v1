import { Point, Camera, Shape } from '@figma-clone/shared';
import { CameraSystem } from './Camera';
export type HandleType =
  | 'tl' 
  | 'tr' 
  | 'bl' 
  | 'br' 
  | 'tc' 
  | 'bc' 
  | 'ml' 
  | 'mr' 
  | 'rot'; 
const DEG_TO_RAD = Math.PI / 180;
const RAD_TO_DEG = 180 / Math.PI;
export interface Handle {
  type: HandleType;
  x: number; 
  y: number; 
}
export class TransformSystem {
  public static getHandles(shape: Shape, camera: Camera): Handle[] {
    const sx = shape.x * camera.zoom + camera.x;
    const sy = shape.y * camera.zoom + camera.y;
    const sw = shape.width * camera.zoom;
    const sh = shape.height * camera.zoom;
    const cx = sx + sw / 2;
    const cy = sy + sh / 2;
    const rawHandles: { type: HandleType; x: number; y: number }[] = [
      { type: 'tl', x: sx, y: sy },
      { type: 'tr', x: sx + sw, y: sy },
      { type: 'bl', x: sx, y: sy + sh },
      { type: 'br', x: sx + sw, y: sy + sh },
      { type: 'tc', x: sx + sw / 2, y: sy },
      { type: 'bc', x: sx + sw / 2, y: sy + sh },
      { type: 'ml', x: sx, y: sy + sh / 2 },
      { type: 'mr', x: sx + sw, y: sy + sh / 2 },
      { type: 'rot', x: sx + sw / 2, y: sy - 24 }, 
    ];
    if (shape.rotation === 0) {
      return rawHandles;
    }
    const cos = Math.cos(shape.rotation * DEG_TO_RAD);
    const sin = Math.sin(shape.rotation * DEG_TO_RAD);
    return rawHandles.map((h) => {
      const dx = h.x - cx;
      const dy = h.y - cy;
      return {
        type: h.type,
        x: cx + dx * cos - dy * sin,
        y: cy + dx * sin + dy * cos,
      };
    });
  }
  public static hitTestHandles(
    screenX: number,
    screenY: number,
    shape: Shape,
    camera: Camera
  ): HandleType | null {
    const handles = this.getHandles(shape, camera);
    const hitTolerance = 6; 
    for (const h of handles) {
      const dist = Math.hypot(screenX - h.x, screenY - h.y);
      if (dist <= hitTolerance + 2) {
        return h.type;
      }
    }
    return null;
  }
  public static resize(
    shape: Shape,
    handle: HandleType,
    startWorldX: number,
    startWorldY: number,
    currentWorldX: number,
    currentWorldY: number
  ): Partial<Shape> {
    const rad = shape.rotation * DEG_TO_RAD;
    const cos = Math.cos(-rad);
    const sin = Math.sin(-rad);
    const dx = currentWorldX - startWorldX;
    const dy = currentWorldY - startWorldY;
    const rotatedDx = dx * cos - dy * sin;
    const rotatedDy = dx * sin + dy * cos;
    let newX = shape.x;
    let newY = shape.y;
    let newW = shape.width;
    let newH = shape.height;
    const minSize = 10;
    switch (handle) {
      case 'br':
        newW = Math.max(minSize, shape.width + rotatedDx);
        newH = Math.max(minSize, shape.height + rotatedDy);
        break;
      case 'bl':
        newW = Math.max(minSize, shape.width - rotatedDx);
        newH = Math.max(minSize, shape.height + rotatedDy);
        if (newW > minSize) {
          const shiftX = rotatedDx * Math.cos(rad);
          const shiftY = rotatedDx * Math.sin(rad);
          newX = shape.x + shiftX;
        }
        break;
      case 'tr':
        newW = Math.max(minSize, shape.width + rotatedDx);
        newH = Math.max(minSize, shape.height - rotatedDy);
        if (newH > minSize) {
          const shiftX = -rotatedDy * Math.sin(rad);
          const shiftY = rotatedDy * Math.cos(rad);
          newY = shape.y + shiftY;
        }
        break;
      case 'tl':
        newW = Math.max(minSize, shape.width - rotatedDx);
        newH = Math.max(minSize, shape.height - rotatedDy);
        if (newW > minSize) {
          newX = shape.x + rotatedDx * Math.cos(rad);
        }
        if (newH > minSize) {
          newY = shape.y + -rotatedDy * Math.sin(rad);
        }
        break;
      case 'mr':
        newW = Math.max(minSize, shape.width + rotatedDx);
        break;
      case 'ml':
        newW = Math.max(minSize, shape.width - rotatedDx);
        if (newW > minSize) {
          newX = shape.x + rotatedDx * Math.cos(rad);
        }
        break;
      case 'bc':
        newH = Math.max(minSize, shape.height + rotatedDy);
        break;
      case 'tc':
        newH = Math.max(minSize, shape.height - rotatedDy);
        if (newH > minSize) {
          newY = shape.y + -rotatedDy * Math.sin(rad);
        }
        break;
    }
    return { x: newX, y: newY, width: newW, height: newH };
  }
  public static rotate(
    shape: Shape,
    camera: Camera,
    mouseScreenX: number,
    mouseScreenY: number
  ): number {
    const sx = shape.x * camera.zoom + camera.x;
    const sy = shape.y * camera.zoom + camera.y;
    const sw = shape.width * camera.zoom;
    const sh = shape.height * camera.zoom;
    const cx = sx + sw / 2;
    const cy = sy + sh / 2;
    const rad = Math.atan2(mouseScreenY - cy, mouseScreenX - cx);
    let deg = rad * RAD_TO_DEG + 90; 
    if (deg < 0) deg += 360;
    return Math.round(deg % 360);
  }
}
