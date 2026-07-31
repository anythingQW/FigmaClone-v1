import React, { useRef, useEffect } from 'react';
import { useCanvasStore } from '../store/useCanvasStore';
export const Minimap: React.FC = () => {
  const minimapCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const { camera, viewport, setCamera } = useCanvasStore();
  useEffect(() => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#09090b';
    ctx.fillRect(0, 0, width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    const scale = 0.05;
    const viewW = (viewport.width / camera.zoom) * scale;
    const viewH = (viewport.height / camera.zoom) * scale;
    const viewX = centerX - (camera.x / camera.zoom) * scale - viewW / 2;
    const viewY = centerY - (camera.y / camera.zoom) * scale - viewH / 2;
    ctx.strokeStyle = '#6366f1';
    ctx.lineWidth = 1.5;
    ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
    ctx.fillRect(viewX, viewY, viewW, viewH);
    ctx.strokeRect(viewX, viewY, viewW, viewH);
  }, [camera, viewport]);
  const handleMinimapClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const scale = 0.05;
    const targetWorldX = (centerX - clickX) / scale;
    const targetWorldY = (centerY - clickY) / scale;
    setCamera({
      x: targetWorldX * camera.zoom + viewport.width / 2,
      y: targetWorldY * camera.zoom + viewport.height / 2,
    });
  };
  return (
    <div className="absolute bottom-4 right-4 bg-zinc-900/90 border border-zinc-800 rounded-lg p-2 backdrop-blur shadow-2xl flex flex-col space-y-1.5">
      <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
        <span>MINIMAP</span>
        <span>0.05x</span>
      </div>
      <canvas
        ref={minimapCanvasRef}
        width={160}
        height={100}
        onClick={handleMinimapClick}
        className="rounded border border-zinc-800 cursor-pointer"
      />
    </div>
  );
};
