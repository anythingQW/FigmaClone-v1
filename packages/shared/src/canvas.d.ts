export interface Point {
    x: number;
    y: number;
}
export interface Bounds {
    x: number;
    y: number;
    width: number;
    height: number;
}
export interface Camera {
    x: number;
    y: number;
    zoom: number;
}
export interface Viewport {
    width: number;
    height: number;
}
export interface GridConfig {
    enabled: boolean;
    size: number;
    majorFactor: number;
    color: string;
    majorColor: string;
}
