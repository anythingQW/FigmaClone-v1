import { Shape, Camera } from '@figma-clone/shared';
const DEG_TO_RAD = Math.PI / 180;
export class HitTest {
  public static pointInShape(
    screenX: number,
    screenY: number,
    shape: Shape,
    camera: Camera
  ): boolean {
    if (!shape.visible || shape.locked) return false;
    const sx = shape.x * camera.zoom + camera.x;
    const sy = shape.y * camera.zoom + camera.y;
    const sw = shape.width * camera.zoom;
    const sh = shape.height * camera.zoom;
    let testX = screenX;
    let testY = screenY;
    if (shape.rotation !== 0) {
      const cx = sx + sw / 2;
      const cy = sy + sh / 2;
      const cos = Math.cos(-shape.rotation * DEG_TO_RAD);
      const sin = Math.sin(-shape.rotation * DEG_TO_RAD);
      const dx = screenX - cx;
      const dy = screenY - cy;
      testX = cx + dx * cos - dy * sin;
      testY = cy + dx * sin + dy * cos;
    }
    return testX >= sx && testX <= sx + sw && testY >= sy && testY <= sy + sh;
  }
  public static findShapeAtPoint(
    screenX: number,
    screenY: number,
    shapes: Shape[],
    camera: Camera
  ): Shape | null {
    const sorted = [...shapes].sort((a, b) => b.zIndex - a.zIndex);
    for (const shape of sorted) {
      if (this.pointInShape(screenX, screenY, shape, camera)) {
        return shape;
      }
    }
    return null;
  }
  public static findShapesInRect(
    x1: number, y1: number,
    x2: number, y2: number,
    shapes: Shape[],
    camera: Camera
  ): Shape[] {
    const minX = Math.min(x1, x2);
    const minY = Math.min(y1, y2);
    const maxX = Math.max(x1, x2);
    const maxY = Math.max(y1, y2);
    return shapes.filter((shape) => {
      if (!shape.visible || shape.locked) return false;
      const sx = shape.x * camera.zoom + camera.x;
      const sy = shape.y * camera.zoom + camera.y;
      const sw = shape.width * camera.zoom;
      const sh = shape.height * camera.zoom;
      return sx >= minX && sy >= minY && sx + sw <= maxX && sy + sh <= maxY;
    });
  }
}
