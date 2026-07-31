import { Camera, Point, CANVAS_DEFAULTS } from '@figma-clone/shared';
export class CameraSystem {
  public static screenToWorld(screenPoint: Point, camera: Camera): Point {
    return {
      x: (screenPoint.x - camera.x) / camera.zoom,
      y: (screenPoint.y - camera.y) / camera.zoom,
    };
  }
  public static worldToScreen(worldPoint: Point, camera: Camera): Point {
    return {
      x: worldPoint.x * camera.zoom + camera.x,
      y: worldPoint.y * camera.zoom + camera.y,
    };
  }
  public static zoomAtPoint(
    camera: Camera,
    screenPoint: Point,
    deltaZoom: number
  ): Camera {
    const nextZoom = Math.min(
      Math.max(camera.zoom * deltaZoom, CANVAS_DEFAULTS.MIN_ZOOM),
      CANVAS_DEFAULTS.MAX_ZOOM
    );
    const worldPoint = this.screenToWorld(screenPoint, camera);
    return {
      zoom: nextZoom,
      x: screenPoint.x - worldPoint.x * nextZoom,
      y: screenPoint.y - worldPoint.y * nextZoom,
    };
  }
  public static panBy(camera: Camera, dx: number, dy: number): Camera {
    return {
      ...camera,
      x: camera.x + dx,
      y: camera.y + dy,
    };
  }
}
