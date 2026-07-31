import {
  Shape,
  ShapeType,
  Camera,
  RectangleShape,
  EllipseShape,
  LineShape,
  ArrowShape,
  TextShape,
  FrameShape,
  PolygonShape,
  StarShape,
} from '@figma-clone/shared';
const DEG_TO_RAD = Math.PI / 180;
export class ShapeRenderer {
  public static render(
    ctx: CanvasRenderingContext2D,
    shape: Shape,
    camera: Camera,
    isSelected: boolean,
    isHovered: boolean
  ): void {
    if (!shape.visible) return;
    ctx.save();
    ctx.globalAlpha = shape.opacity;
    const screenX = shape.x * camera.zoom + camera.x;
    const screenY = shape.y * camera.zoom + camera.y;
    const screenW = shape.width * camera.zoom;
    const screenH = shape.height * camera.zoom;
    if (shape.rotation !== 0) {
      const cx = screenX + screenW / 2;
      const cy = screenY + screenH / 2;
      ctx.translate(cx, cy);
      ctx.rotate(shape.rotation * DEG_TO_RAD);
      ctx.translate(-cx, -cy);
    }
    switch (shape.type) {
      case ShapeType.RECTANGLE:
        this.drawRectangle(ctx, shape, screenX, screenY, screenW, screenH, camera.zoom);
        break;
      case ShapeType.ELLIPSE:
        this.drawEllipse(ctx, shape, screenX, screenY, screenW, screenH);
        break;
      case ShapeType.LINE:
        this.drawLine(ctx, shape, camera);
        break;
      case ShapeType.ARROW:
        this.drawArrow(ctx, shape, camera);
        break;
      case ShapeType.TEXT:
        this.drawText(ctx, shape, screenX, screenY, screenW, screenH, camera.zoom);
        break;
      case ShapeType.FRAME:
        this.drawFrame(ctx, shape, screenX, screenY, screenW, screenH, camera.zoom);
        break;
      case ShapeType.POLYGON:
        this.drawPolygon(ctx, shape, screenX, screenY, screenW, screenH);
        break;
      case ShapeType.STAR:
        this.drawStar(ctx, shape, screenX, screenY, screenW, screenH);
        break;
    }
    if (isSelected) {
      this.drawSelectionBox(ctx, screenX, screenY, screenW, screenH);
    } else if (isHovered) {
      this.drawHoverBox(ctx, screenX, screenY, screenW, screenH);
    }
    ctx.restore();
  }
  private static getFillStyle(
    ctx: CanvasRenderingContext2D,
    fill: any,
    x: number,
    y: number,
    w: number,
    h: number
  ): string | CanvasGradient {
    if (fill.gradientType === 'linear' && fill.gradientColorFrom && fill.gradientColorTo) {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const angleRad = ((fill.gradientAngle ?? 135) - 90) * Math.PI / 180;
      const r = Math.sqrt(w * w + h * h) / 2;
      const x0 = cx - Math.cos(angleRad) * r;
      const y0 = cy - Math.sin(angleRad) * r;
      const x1 = cx + Math.cos(angleRad) * r;
      const y1 = cy + Math.sin(angleRad) * r;
      const grad = ctx.createLinearGradient(x0, y0, x1, y1);
      grad.addColorStop(0, fill.gradientColorFrom);
      grad.addColorStop(1, fill.gradientColorTo);
      return grad;
    }
    return fill.color;
  }
  private static drawRectangle(
    ctx: CanvasRenderingContext2D,
    shape: RectangleShape,
    x: number, y: number, w: number, h: number,
    zoom: number
  ): void {
    const radius = (shape.cornerRadius ?? 0) * zoom;
    this.applyShadow(ctx, shape);

    if ((shape as any).iconPath) {
      if (shape.fill && shape.fill.color !== 'transparent') {
        ctx.fillStyle = this.getFillStyle(ctx, shape.fill, x, y, w, h);
        ctx.globalAlpha *= shape.fill.opacity;
        this.roundRect(ctx, x, y, w, h, radius);
        ctx.fill();
        ctx.globalAlpha = shape.opacity;
      }
      ctx.save();
      const p = new Path2D((shape as any).iconPath);
      ctx.translate(x + w / 2, y + h / 2);
      ctx.scale((w * 0.85) / 24, (h * 0.85) / 24);
      ctx.translate(-12, -12);
      ctx.strokeStyle = shape.stroke?.color || '#ffffff';
      ctx.lineWidth = (shape.stroke?.width || 2);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(p);
      ctx.restore();
      return;
    }

    if (shape.fill) {
      ctx.fillStyle = this.getFillStyle(ctx, shape.fill, x, y, w, h);
      ctx.globalAlpha *= shape.fill.opacity;
      this.roundRect(ctx, x, y, w, h, radius);
      ctx.fill();
      ctx.globalAlpha = shape.opacity;
    }
    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke.color;
      ctx.lineWidth = shape.stroke.width * zoom;
      ctx.globalAlpha *= shape.stroke.opacity;
      this.roundRect(ctx, x, y, w, h, radius);
      ctx.stroke();
    }
  }
  private static drawEllipse(
    ctx: CanvasRenderingContext2D,
    shape: EllipseShape,
    x: number, y: number, w: number, h: number
  ): void {
    this.applyShadow(ctx, shape);
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = w / 2;
    const ry = h / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    if (shape.fill) {
      ctx.fillStyle = this.getFillStyle(ctx, shape.fill, x, y, w, h);
      ctx.globalAlpha *= shape.fill.opacity;
      ctx.fill();
      ctx.globalAlpha = shape.opacity;
    }
    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke.color;
      ctx.lineWidth = shape.stroke.width;
      ctx.globalAlpha *= shape.stroke.opacity;
      ctx.stroke();
    }
  }
  private static drawLine(
    ctx: CanvasRenderingContext2D,
    shape: LineShape,
    camera: Camera
  ): void {
    const sx = shape.x * camera.zoom + camera.x;
    const sy = shape.y * camera.zoom + camera.y;
    const ex = shape.x2 * camera.zoom + camera.x;
    const ey = shape.y2 * camera.zoom + camera.y;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke.color;
      ctx.lineWidth = shape.stroke.width * camera.zoom;
      ctx.lineCap = 'round';
      if (shape.stroke.dashPattern) {
        ctx.setLineDash(shape.stroke.dashPattern.map(d => d * camera.zoom));
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }
  private static drawArrow(
    ctx: CanvasRenderingContext2D,
    shape: ArrowShape,
    camera: Camera
  ): void {
    const sx = shape.x * camera.zoom + camera.x;
    const sy = shape.y * camera.zoom + camera.y;
    const ex = shape.x2 * camera.zoom + camera.x;
    const ey = shape.y2 * camera.zoom + camera.y;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(ex, ey);
    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke.color;
      ctx.lineWidth = shape.stroke.width * camera.zoom;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
    const arrowSize = 12 * camera.zoom;
    const angle = Math.atan2(ey - sy, ex - sx);
    ctx.beginPath();
    ctx.moveTo(ex, ey);
    ctx.lineTo(
      ex - arrowSize * Math.cos(angle - Math.PI / 6),
      ey - arrowSize * Math.sin(angle - Math.PI / 6)
    );
    ctx.lineTo(
      ex - arrowSize * Math.cos(angle + Math.PI / 6),
      ey - arrowSize * Math.sin(angle + Math.PI / 6)
    );
    ctx.closePath();
    if (shape.stroke) {
      ctx.fillStyle = shape.stroke.color;
      ctx.fill();
    }
  }
  private static drawText(
    ctx: CanvasRenderingContext2D,
    shape: TextShape,
    x: number, y: number, w: number, h: number,
    zoom: number
  ): void {
    const fontSize = shape.fontSize * zoom;
    ctx.font = `${shape.fontWeight} ${fontSize}px ${shape.fontFamily}`;
    ctx.textAlign = shape.textAlign as CanvasTextAlign;
    ctx.textBaseline = 'top';

    // Support modern letter-spacing if available
    if ('letterSpacing' in ctx && shape.letterSpacing) {
      (ctx as any).letterSpacing = `${shape.letterSpacing * zoom}px`;
    }

    if (shape.fill) {
      ctx.fillStyle = this.getFillStyle(ctx, shape.fill, x, y, w, h);
      ctx.globalAlpha *= shape.fill.opacity;
    }
    
    let textX = x;
    if (shape.textAlign === 'center') textX = x + w / 2;
    else if (shape.textAlign === 'right') textX = x + w;

    let content = shape.content;
    if (shape.textTransform === 'uppercase') content = content.toUpperCase();
    else if (shape.textTransform === 'lowercase') content = content.toLowerCase();
    else if (shape.textTransform === 'capitalize') {
      content = content.replace(/\b\w/g, c => c.toUpperCase());
    }

    const lines = content.split('\n');
    const lineHeight = (shape.lineHeight || shape.fontSize * 1.2) * zoom;
    
    lines.forEach((line, i) => {
      const lineY = y + 4 * zoom + (i * lineHeight);
      ctx.fillText(line, textX, lineY);

      if (shape.textDecoration && shape.textDecoration !== 'none') {
        const metrics = ctx.measureText(line);
        const textW = metrics.width;
        let lineStartX = textX;
        if (shape.textAlign === 'center') lineStartX = textX - textW / 2;
        else if (shape.textAlign === 'right') lineStartX = textX - textW;
        
        ctx.save();
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = Math.max(1, fontSize * 0.08);
        ctx.beginPath();
        
        const yOffset = shape.textDecoration === 'underline' ? fontSize * 1.1 : fontSize * 0.5;
        ctx.moveTo(lineStartX, lineY + yOffset);
        ctx.lineTo(lineStartX + textW, lineY + yOffset);
        ctx.stroke();
        ctx.restore();
      }
    });

    if ('letterSpacing' in ctx) {
      (ctx as any).letterSpacing = '0px';
    }
  }
  private static drawFrame(
    ctx: CanvasRenderingContext2D,
    shape: FrameShape,
    x: number, y: number, w: number, h: number,
    zoom: number
  ): void {
    const labelSize = 11 * zoom;
    ctx.font = `500 ${labelSize}px Inter`;
    ctx.fillStyle = '#a1a1aa';
    ctx.textBaseline = 'bottom';
    ctx.fillText(shape.name, x, y - 4 * zoom);
    if (shape.fill) {
      ctx.fillStyle = this.getFillStyle(ctx, shape.fill, x, y, w, h);
      ctx.globalAlpha *= shape.fill.opacity;
      ctx.fillRect(x, y, w, h);
      ctx.globalAlpha = shape.opacity;
    }
    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke.color;
      ctx.lineWidth = shape.stroke.width * zoom;
      ctx.globalAlpha *= shape.stroke.opacity;
      ctx.strokeRect(x, y, w, h);
    }
  }
  private static drawPolygon(
    ctx: CanvasRenderingContext2D,
    shape: PolygonShape,
    x: number, y: number, w: number, h: number
  ): void {
    this.applyShadow(ctx, shape);
    const cx = x + w / 2;
    const cy = y + h / 2;
    const rx = w / 2;
    const ry = h / 2;
    const sides = shape.sides;
    const angleStep = (Math.PI * 2) / sides;
    const startAngle = -Math.PI / 2;
    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
      const angle = startAngle + i * angleStep;
      const px = cx + rx * Math.cos(angle);
      const py = cy + ry * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (shape.fill) {
      ctx.fillStyle = this.getFillStyle(ctx, shape.fill, x, y, w, h);
      ctx.globalAlpha *= shape.fill.opacity;
      ctx.fill();
      ctx.globalAlpha = shape.opacity;
    }
    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke.color;
      ctx.lineWidth = shape.stroke.width;
      ctx.globalAlpha *= shape.stroke.opacity;
      ctx.stroke();
    }
  }
  private static drawStar(
    ctx: CanvasRenderingContext2D,
    shape: StarShape,
    x: number, y: number, w: number, h: number
  ): void {
    this.applyShadow(ctx, shape);
    const cx = x + w / 2;
    const cy = y + h / 2;
    const outerRx = w / 2;
    const outerRy = h / 2;
    const innerRx = outerRx * shape.innerRadiusRatio;
    const innerRy = outerRy * shape.innerRadiusRatio;
    const points = shape.points;
    const angleStep = Math.PI / points;
    const startAngle = -Math.PI / 2;
    ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
      const angle = startAngle + i * angleStep;
      const isOuter = i % 2 === 0;
      const rx = isOuter ? outerRx : innerRx;
      const ry = isOuter ? outerRy : innerRy;
      const px = cx + rx * Math.cos(angle);
      const py = cy + ry * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (shape.fill) {
      ctx.fillStyle = this.getFillStyle(ctx, shape.fill, x, y, w, h);
      ctx.globalAlpha *= shape.fill.opacity;
      ctx.fill();
      ctx.globalAlpha = shape.opacity;
    }
    if (shape.stroke) {
      ctx.strokeStyle = shape.stroke.color;
      ctx.lineWidth = shape.stroke.width;
      ctx.globalAlpha *= shape.stroke.opacity;
      ctx.stroke();
    }
  }
  private static applyShadow(ctx: CanvasRenderingContext2D, shape: Shape): void {
    if (shape.shadow) {
      ctx.shadowColor = shape.shadow.color;
      ctx.shadowBlur = shape.shadow.blur;
      ctx.shadowOffsetX = shape.shadow.offsetX;
      ctx.shadowOffsetY = shape.shadow.offsetY;
    }
  }
  private static roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number,
    radius: number
  ): void {
    const r = Math.min(radius, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }
  private static drawSelectionBox(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number
  ): void {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([]);
    ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
    const handleSize = 7;
    const handles = [
      { x: x - handleSize / 2, y: y - handleSize / 2 },
      { x: x + w - handleSize / 2, y: y - handleSize / 2 },
      { x: x - handleSize / 2, y: y + h - handleSize / 2 },
      { x: x + w - handleSize / 2, y: y + h - handleSize / 2 },
      { x: x + w / 2 - handleSize / 2, y: y - handleSize / 2 },
      { x: x + w / 2 - handleSize / 2, y: y + h - handleSize / 2 },
      { x: x - handleSize / 2, y: y + h / 2 - handleSize / 2 },
      { x: x + w - handleSize / 2, y: y + h / 2 - handleSize / 2 },
    ];
    handles.forEach(({ x: hx, y: hy }) => {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(hx, hy, handleSize, handleSize);
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.strokeRect(hx, hy, handleSize, handleSize);
    });
    const rx = x + w / 2;
    const ry = y;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx, ry - 24);
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(rx, ry - 24, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }
  private static drawHoverBox(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number
  ): void {
    ctx.save();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 1;
    ctx.setLineDash([]);
    ctx.strokeRect(x - 0.5, y - 0.5, w + 1, h + 1);
    ctx.restore();
  }
}
