import { Camera, GridConfig, Viewport } from '@figma-clone/shared';
export class GridRenderer {
  public static render(
    ctx: CanvasRenderingContext2D,
    camera: Camera,
    viewport: Viewport,
    grid: GridConfig
  ): void {
    ctx.clearRect(0, 0, viewport.width, viewport.height);
    if (!grid.enabled) return;
    const scaledGridSize = grid.size * camera.zoom;
    if (scaledGridSize < 5) return;
    ctx.save();
    ctx.lineWidth = 1;
    const startX = (camera.x % scaledGridSize) - scaledGridSize;
    const startY = (camera.y % scaledGridSize) - scaledGridSize;
    ctx.strokeStyle = grid.color;
    ctx.beginPath();
    for (let x = startX; x <= viewport.width + scaledGridSize; x += scaledGridSize) {
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, viewport.height);
    }
    for (let y = startY; y <= viewport.height + scaledGridSize; y += scaledGridSize) {
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(viewport.width, Math.floor(y) + 0.5);
    }
    ctx.stroke();
    const majorScaledSize = scaledGridSize * grid.majorFactor;
    const majorStartX = (camera.x % majorScaledSize) - majorScaledSize;
    const majorStartY = (camera.y % majorScaledSize) - majorScaledSize;
    ctx.strokeStyle = grid.majorColor;
    ctx.beginPath();
    for (let x = majorStartX; x <= viewport.width + majorScaledSize; x += majorScaledSize) {
      ctx.moveTo(Math.floor(x) + 0.5, 0);
      ctx.lineTo(Math.floor(x) + 0.5, viewport.height);
    }
    for (let y = majorStartY; y <= viewport.height + majorScaledSize; y += majorScaledSize) {
      ctx.moveTo(0, Math.floor(y) + 0.5);
      ctx.lineTo(viewport.width, Math.floor(y) + 0.5);
    }
    ctx.stroke();
    if (camera.x >= 0 && camera.x <= viewport.width) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)'; 
      ctx.beginPath();
      ctx.moveTo(Math.floor(camera.x) + 0.5, 0);
      ctx.lineTo(Math.floor(camera.x) + 0.5, viewport.height);
      ctx.stroke();
    }
    if (camera.y >= 0 && camera.y <= viewport.height) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)'; 
      ctx.beginPath();
      ctx.moveTo(0, Math.floor(camera.y) + 0.5);
      ctx.lineTo(viewport.width, Math.floor(camera.y) + 0.5);
      ctx.stroke();
    }
    ctx.restore();
  }
}
