export declare enum ShapeType {
    RECTANGLE = "RECTANGLE",
    ELLIPSE = "ELLIPSE",
    LINE = "LINE",
    ARROW = "ARROW",
    TEXT = "TEXT",
    FRAME = "FRAME",
    POLYGON = "POLYGON",
    STAR = "STAR",
    BEZIER_PATH = "BEZIER_PATH"
}
export interface FillStyle {
    color: string;
    opacity: number;
    gradientType?: 'solid' | 'linear';
    gradientColorFrom?: string;
    gradientColorTo?: string;
    gradientAngle?: number;
}
export interface StrokeStyle {
    color: string;
    width: number;
    opacity: number;
    dashPattern?: number[];
}
export interface ShadowStyle {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
}
export interface BaseShape {
    id: string;
    type: ShapeType;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    visible: boolean;
    locked: boolean;
    fill?: FillStyle;
    stroke?: StrokeStyle;
    shadow?: ShadowStyle;
    zIndex: number;
}
export interface RectangleShape extends BaseShape {
    type: ShapeType.RECTANGLE;
    cornerRadius?: number;
}
export interface EllipseShape extends BaseShape {
    type: ShapeType.ELLIPSE;
}
export interface LineShape extends BaseShape {
    type: ShapeType.LINE;
    x2: number;
    y2: number;
}
export interface ArrowShape extends BaseShape {
    type: ShapeType.ARROW;
    x2: number;
    y2: number;
}
export interface TextShape extends BaseShape {
    type: ShapeType.TEXT;
    content: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    textAlign: 'left' | 'center' | 'right';
    lineHeight?: number;
    letterSpacing?: number;
    textDecoration?: 'none' | 'underline' | 'line-through';
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
}
export interface FrameShape extends BaseShape {
    type: ShapeType.FRAME;
    childrenIds: string[];
}
export interface PolygonShape extends BaseShape {
    type: ShapeType.POLYGON;
    sides: number;
}
export interface StarShape extends BaseShape {
    type: ShapeType.STAR;
    points: number;
    innerRadiusRatio: number;
}
export interface BezierControlPoint {
    x: number;
    y: number;
    cp1x?: number;
    cp1y?: number;
    cp2x?: number;
    cp2y?: number;
}
export interface BezierPathShape extends BaseShape {
    type: ShapeType.BEZIER_PATH;
    points: BezierControlPoint[];
}
export type Shape = RectangleShape | EllipseShape | LineShape | ArrowShape | TextShape | FrameShape | PolygonShape | StarShape | BezierPathShape;
//# sourceMappingURL=shapes.d.ts.map