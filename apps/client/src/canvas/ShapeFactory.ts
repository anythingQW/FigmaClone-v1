import {
  Shape,
  ShapeType,
  RectangleShape,
  EllipseShape,
  LineShape,
  ArrowShape,
  TextShape,
  FrameShape,
  PolygonShape,
  StarShape,
  FillStyle,
  StrokeStyle,
} from '@figma-clone/shared';
let shapeCounter = 0;
function generateId(): string {
  shapeCounter++;
  return `shape_${Date.now()}_${shapeCounter}`;
}
const DEFAULT_FILL: FillStyle = {
  color: '#6366f1',
  opacity: 1,
};
const DEFAULT_STROKE: StrokeStyle = {
  color: '#4f46e5',
  width: 1,
  opacity: 1,
};
const TEXT_FILL: FillStyle = {
  color: '#e4e4e7',
  opacity: 1,
};
interface ShapeCreationParams {
  x: number;
  y: number;
  width?: number;
  height?: number;
  zIndex: number;
}
export class ShapeFactory {
  public static createRectangle(params: ShapeCreationParams): RectangleShape {
    return {
      id: generateId(),
      type: ShapeType.RECTANGLE,
      name: `Rectangle ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 200,
      height: params.height ?? 120,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: { ...DEFAULT_FILL },
      stroke: { ...DEFAULT_STROKE },
      zIndex: params.zIndex,
      cornerRadius: 8,
    };
  }
  public static createEllipse(params: ShapeCreationParams): EllipseShape {
    return {
      id: generateId(),
      type: ShapeType.ELLIPSE,
      name: `Ellipse ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 160,
      height: params.height ?? 160,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: { ...DEFAULT_FILL, color: '#a855f7' },
      stroke: { ...DEFAULT_STROKE, color: '#9333ea' },
      zIndex: params.zIndex,
    };
  }
  public static createLine(params: ShapeCreationParams & { x2?: number; y2?: number }): LineShape {
    return {
      id: generateId(),
      type: ShapeType.LINE,
      name: `Line ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 200,
      height: params.height ?? 0,
      x2: params.x2 ?? params.x + 200,
      y2: params.y2 ?? params.y,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      stroke: { ...DEFAULT_STROKE, color: '#f59e0b', width: 2 },
      zIndex: params.zIndex,
    };
  }
  public static createArrow(params: ShapeCreationParams & { x2?: number; y2?: number }): ArrowShape {
    return {
      id: generateId(),
      type: ShapeType.ARROW,
      name: `Arrow ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 200,
      height: params.height ?? 0,
      x2: params.x2 ?? params.x + 200,
      y2: params.y2 ?? params.y,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      stroke: { ...DEFAULT_STROKE, color: '#ef4444', width: 2 },
      zIndex: params.zIndex,
    };
  }
  public static createText(params: ShapeCreationParams): TextShape {
    return {
      id: generateId(),
      type: ShapeType.TEXT,
      name: `Text ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 200,
      height: params.height ?? 40,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: { ...TEXT_FILL },
      zIndex: params.zIndex,
      content: 'Type here...',
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: '400',
      textAlign: 'left',
    };
  }
  public static createFrame(params: ShapeCreationParams): FrameShape {
    return {
      id: generateId(),
      type: ShapeType.FRAME,
      name: `Frame ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 375,
      height: params.height ?? 667,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: { color: '#1e1e1e', opacity: 1 },
      stroke: { color: '#3f3f46', width: 1, opacity: 0.5 },
      zIndex: params.zIndex,
      childrenIds: [],
    };
  }
  public static createPolygon(params: ShapeCreationParams): PolygonShape {
    return {
      id: generateId(),
      type: ShapeType.POLYGON,
      name: `Polygon ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 140,
      height: params.height ?? 140,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: { ...DEFAULT_FILL, color: '#14b8a6' },
      stroke: { ...DEFAULT_STROKE, color: '#0d9488' },
      zIndex: params.zIndex,
      sides: 6,
    };
  }
  public static createStar(params: ShapeCreationParams): StarShape {
    return {
      id: generateId(),
      type: ShapeType.STAR,
      name: `Star ${shapeCounter}`,
      x: params.x,
      y: params.y,
      width: params.width ?? 140,
      height: params.height ?? 140,
      rotation: 0,
      opacity: 1,
      visible: true,
      locked: false,
      fill: { ...DEFAULT_FILL, color: '#f59e0b' },
      stroke: { ...DEFAULT_STROKE, color: '#d97706' },
      zIndex: params.zIndex,
      points: 5,
      innerRadiusRatio: 0.4,
    };
  }
}
