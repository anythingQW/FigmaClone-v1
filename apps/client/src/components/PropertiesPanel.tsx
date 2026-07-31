import React, { useState } from 'react';
import { useShapesStore } from '../store/useShapesStore';
import { Shape, ShapeType } from '@figma-clone/shared';
import {
  AlignLeft, AlignCenter, AlignRight,
  ChevronDown, ChevronRight, Eye, EyeOff, Lock, Unlock,
  Minus, Plus, Sun, Layers, Type, Move, RotateCcw,
} from 'lucide-react';
function SectionHeader({
  label,
  open,
  toggle,
}: {
  label: string;
  open: boolean;
  toggle: () => void;
}) {
  return (
    <button
      onClick={toggle}
      className="w-full flex items-center justify-between py-1.5 group"
    >
      <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
        {label}
      </span>
      {open ? (
        <ChevronDown className="w-3 h-3 text-zinc-600" />
      ) : (
        <ChevronRight className="w-3 h-3 text-zinc-600" />
      )}
    </button>
  );
}
function NumInput({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  wide = false,
}: {
  label: string;
  value: number | string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex items-center bg-zinc-900/80 border border-zinc-800/60 rounded-lg px-2 py-1.5 hover:border-zinc-700/60 focus-within:border-indigo-500/40 focus-within:ring-1 focus-within:ring-indigo-500/15 transition-all ${wide ? 'col-span-2' : ''}`}
    >
      <span className="text-[9px] text-zinc-600 font-mono w-5 shrink-0 select-none">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="bg-transparent border-none outline-none text-zinc-200 text-[11px] w-full text-right tabular-nums"
      />
    </div>
  );
}
export const PropertiesPanel: React.FC = () => {
  const { shapes, selectedIds, updateShape } = useShapesStore();
  const [geomOpen, setGeomOpen] = useState(true);
  const [fillOpen, setFillOpen] = useState(true);
  const [strokeOpen, setStrokeOpen] = useState(true);
  const [shadowOpen, setShadowOpen] = useState(false);
  const [typoOpen, setTypoOpen] = useState(true);
  const [fillType, setFillType] = useState<'solid' | 'linear'>('solid');
  const [gradientFrom, setGradientFrom] = useState('#6366f1');
  const [gradientTo, setGradientTo] = useState('#a855f7');
  const [gradientAngle, setGradientAngle] = useState(135);
  const selectedShapes = shapes.filter((s) => selectedIds.has(s.id));
  const activeShape = selectedShapes[0];
  if (!activeShape) {
    return (
      <div className="flex flex-col h-full">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-600 pb-3 border-b border-zinc-800/60 mb-3">
          Properties
        </p>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/40 flex items-center justify-center mb-1">
            <Layers className="w-4.5 h-4.5 text-zinc-600" />
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            Select a shape to view and edit its properties
          </p>
        </div>
      </div>
    );
  }
  const isMultiSelect = selectedShapes.length > 1;
  const handleChange = (key: string, value: any) => {
    selectedShapes.forEach((shape) => updateShape(shape.id, { [key]: value }));
  };
  const handleFillColor = (color: string) => {
    selectedShapes.forEach((shape) => {
      if (shape.fill) {
        updateShape(shape.id, {
          fill: {
            ...shape.fill,
            color,
            gradientType: fillType,
            gradientColorFrom: gradientFrom,
            gradientColorTo: gradientTo,
            gradientAngle: gradientAngle
          }
        });
      }
    });
  };
  const handleFillOpacity = (opacity: number) => {
    selectedShapes.forEach((shape) => {
      if (shape.fill) updateShape(shape.id, { fill: { ...shape.fill, opacity: Math.min(1, Math.max(0, opacity / 100)) } });
    });
  };
  const handleStroke = (key: string, value: any) => {
    selectedShapes.forEach((shape) => {
      if (shape.stroke) updateShape(shape.id, { stroke: { ...shape.stroke, [key]: value } });
    });
  };
  const handleShadow = (key: string, value: any) => {
    selectedShapes.forEach((shape) => {
      const existing = (shape as any).shadow ?? { color: '#000000', blur: 10, offsetX: 0, offsetY: 4 };
      updateShape(shape.id, { shadow: { ...existing, [key]: value } } as any);
    });
  };
  const toggleShadow = () => {
    const hasShadow = !!(activeShape as any).shadow;
    selectedShapes.forEach((shape) => {
      if (hasShadow) {
        updateShape(shape.id, { shadow: undefined } as any);
      } else {
        updateShape(shape.id, { shadow: { color: '#000000', blur: 12, offsetX: 0, offsetY: 4 } } as any);
      }
    });
  };
  const applyGradient = () => {
    selectedShapes.forEach((shape) => {
      if (shape.fill) {
        updateShape(shape.id, {
          fill: {
            ...shape.fill,
            gradientType: 'linear',
            gradientColorFrom: gradientFrom,
            gradientColorTo: gradientTo,
            gradientAngle: gradientAngle
          }
        });
      }
    });
  };
  const shadow = (activeShape as any).shadow;
  const hasShadow = !!shadow;
  const fillOpacityPct = activeShape.fill ? Math.round(activeShape.fill.opacity * 100) : 100;
  return (
    <div className="flex flex-col h-full text-zinc-400 overflow-y-auto">
      <div className="pb-3 border-b border-zinc-800/60 mb-1 shrink-0">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-[11px] font-bold text-zinc-200 truncate">
            {isMultiSelect ? `${selectedShapes.length} selected` : activeShape.name}
          </h3>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleChange('visible', !activeShape.visible)}
              className="p-1 rounded hover:bg-zinc-800/60 text-zinc-600 hover:text-zinc-300 transition-colors"
              title={activeShape.visible ? 'Hide' : 'Show'}
            >
              {activeShape.visible
                ? <Eye className="w-3 h-3" />
                : <EyeOff className="w-3 h-3" />
              }
            </button>
            <button
              onClick={() => handleChange('locked', !activeShape.locked)}
              className="p-1 rounded hover:bg-zinc-800/60 text-zinc-600 hover:text-zinc-300 transition-colors"
              title={activeShape.locked ? 'Unlock' : 'Lock'}
            >
              {activeShape.locked
                ? <Lock className="w-3 h-3 text-amber-400" />
                : <Unlock className="w-3 h-3" />
              }
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[9px] font-mono text-zinc-600 bg-zinc-900/60 px-1.5 py-0.5 rounded">
            {activeShape.type}
          </span>
          {!isMultiSelect && (
            <span className="text-[9px] font-mono text-zinc-700 truncate">
              #{activeShape.id.slice(-6)}
            </span>
          )}
        </div>
      </div>
      <div className="py-2 border-b border-zinc-800/60 flex items-center justify-around shrink-0 mb-1">
        <button
          disabled={selectedShapes.length < 2}
          onClick={() => useShapesStore.getState().alignSelected('left')}
          className={`p-1.5 rounded hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors ${selectedShapes.length < 2 ? 'opacity-35 cursor-not-allowed' : ''}`}
          title="Align Left"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 1V13M5 3.5H11V6H5V3.5ZM5 8H9V10.5H5V8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          disabled={selectedShapes.length < 2}
          onClick={() => useShapesStore.getState().alignSelected('center')}
          className={`p-1.5 rounded hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors ${selectedShapes.length < 2 ? 'opacity-35 cursor-not-allowed' : ''}`}
          title="Align Horizontal Centers"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7 1V13M3 3.5H11V6H3V3.5ZM4.5 8H9.5V10.5H4.5V8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          disabled={selectedShapes.length < 2}
          onClick={() => useShapesStore.getState().alignSelected('right')}
          className={`p-1.5 rounded hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors ${selectedShapes.length < 2 ? 'opacity-35 cursor-not-allowed' : ''}`}
          title="Align Right"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 1V13M3 3.5H9V6H3V3.5ZM5 8H9V10.5H5V8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="w-px h-4 bg-zinc-800/60" />
        <button
          disabled={selectedShapes.length < 2}
          onClick={() => useShapesStore.getState().alignSelected('top')}
          className={`p-1.5 rounded hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors ${selectedShapes.length < 2 ? 'opacity-35 cursor-not-allowed' : ''}`}
          title="Align Top"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 2H13M3.5 5V11H6V5H3.5ZM8 5V9H10.5V5H8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          disabled={selectedShapes.length < 2}
          onClick={() => useShapesStore.getState().alignSelected('middle')}
          className={`p-1.5 rounded hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors ${selectedShapes.length < 2 ? 'opacity-35 cursor-not-allowed' : ''}`}
          title="Align Vertical Centers"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 7H13M3.5 3V11H6V3H3.5ZM8 4.5V9.5H10.5V4.5H8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          disabled={selectedShapes.length < 2}
          onClick={() => useShapesStore.getState().alignSelected('bottom')}
          className={`p-1.5 rounded hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-colors ${selectedShapes.length < 2 ? 'opacity-35 cursor-not-allowed' : ''}`}
          title="Align Bottom"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 12H13M3.5 3V9H6V3H3.5ZM8 5V9H10.5V5H8Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className="space-y-0.5 flex-1">
        <div className="border-b border-zinc-800/40 pb-2 mb-1">
          <SectionHeader label="Geometry" open={geomOpen} toggle={() => setGeomOpen((v) => !v)} />
          {geomOpen && (
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              <NumInput label="X" value={isMultiSelect ? '' : Math.round(activeShape.x)} onChange={(v) => handleChange('x', v)} />
              <NumInput label="Y" value={isMultiSelect ? '' : Math.round(activeShape.y)} onChange={(v) => handleChange('y', v)} />
              <NumInput label="W" value={isMultiSelect ? '' : Math.round(activeShape.width)} onChange={(v) => handleChange('width', Math.max(1, v))} min={1} />
              <NumInput label="H" value={isMultiSelect ? '' : Math.round(activeShape.height)} onChange={(v) => handleChange('height', Math.max(1, v))} min={1} />
              <NumInput label="R°" value={isMultiSelect ? '' : activeShape.rotation} onChange={(v) => handleChange('rotation', v)} />
              <NumInput label="Op%" value={isMultiSelect ? '' : Math.round(activeShape.opacity * 100)} onChange={(v) => handleChange('opacity', Math.min(1, Math.max(0, v / 100)))} min={0} max={100} />
              {activeShape.type === ShapeType.RECTANGLE && !isMultiSelect && (
                <NumInput label="Rad" value={activeShape.cornerRadius ?? 0} onChange={(v) => handleChange('cornerRadius', Math.max(0, v))} min={0} wide />
              )}
              {activeShape.type === ShapeType.POLYGON && !isMultiSelect && (
                <NumInput label="Sides" value={(activeShape as any).sides ?? 5} onChange={(v) => handleChange('sides', Math.max(3, Math.round(v)))} min={3} wide />
              )}
              {activeShape.type === ShapeType.STAR && !isMultiSelect && (
                <>
                  <NumInput label="Pts" value={(activeShape as any).points ?? 5} onChange={(v) => handleChange('points', Math.max(3, Math.round(v)))} min={3} />
                  <NumInput label="IR%" value={Math.round(((activeShape as any).innerRadiusRatio ?? 0.4) * 100)} onChange={(v) => handleChange('innerRadiusRatio', Math.min(1, Math.max(0.05, v / 100)))} min={5} max={95} />
                </>
              )}
            </div>
          )}
        </div>
        {activeShape.fill && (
          <div className="border-b border-zinc-800/40 pb-2 mb-1">
            <SectionHeader label="Fill" open={fillOpen} toggle={() => setFillOpen((v) => !v)} />
            {fillOpen && (
              <div className="space-y-2 mt-1.5">
                <div className="flex items-center space-x-1 bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-0.5">
                  <button
                    onClick={() => {
                      setFillType('solid');
                      selectedShapes.forEach((shape) => {
                        if (shape.fill) {
                          updateShape(shape.id, {
                            fill: {
                              ...shape.fill,
                              gradientType: 'solid'
                            }
                          });
                        }
                      });
                    }}
                    className={`flex-1 py-1 text-[10px] font-medium rounded transition-all ${
                      (activeShape.fill?.gradientType ?? 'solid') === 'solid' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() => {
                      setFillType('linear');
                      selectedShapes.forEach((shape) => {
                        if (shape.fill) {
                          updateShape(shape.id, {
                            fill: {
                              ...shape.fill,
                              gradientType: 'linear',
                              gradientColorFrom: gradientFrom,
                              gradientColorTo: gradientTo,
                              gradientAngle: gradientAngle
                            }
                          });
                        }
                      });
                    }}
                    className={`flex-1 py-1 text-[10px] font-medium rounded transition-all ${
                      activeShape.fill?.gradientType === 'linear' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Gradient
                  </button>
                </div>
                {(activeShape.fill?.gradientType ?? 'solid') === 'solid' ? (
                  <>
                    <div className="flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800/60 rounded-lg px-2.5 py-2 hover:border-zinc-700/60 transition-all">
                      <input
                        type="color"
                        value={activeShape.fill.color.startsWith('#') ? activeShape.fill.color : '#6366f1'}
                        onChange={(e) => handleFillColor(e.target.value)}
                        className="w-6 h-6 rounded-md border border-zinc-700/60 cursor-pointer flex-shrink-0"
                        style={{ background: 'none' }}
                      />
                      <span className="font-mono text-zinc-300 uppercase text-[11px] flex-1 truncate">
                        {activeShape.fill.color}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-zinc-600">Fill Opacity</span>
                        <span className="text-[10px] font-mono text-zinc-400">{fillOpacityPct}%</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={fillOpacityPct}
                        onChange={(e) => handleFillOpacity(parseInt(e.target.value))}
                        className="w-full h-1.5 rounded-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                    <div className="pt-1">
                      <span className="text-[9px] text-zinc-600 font-medium block mb-1.5">Preset Swatches</span>
                      <div className="grid grid-cols-7 gap-1">
                        {[
                          '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e',
                          '#ef4444', '#f97316', '#f59e0b', '#eab308',
                          '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6',
                          '#18181b', '#27272a', '#a1a1aa', '#ffffff',
                        ].map((c) => (
                          <button
                            key={c}
                            onClick={() => handleFillColor(c)}
                            className="w-5 h-5 rounded-md border border-zinc-700/50 hover:scale-110 transition-transform shadow"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div
                      className="w-full h-8 rounded-lg border border-zinc-800/60"
                      style={{ background: `linear-gradient(${activeShape.fill.gradientAngle ?? gradientAngle}deg, ${activeShape.fill.gradientColorFrom ?? gradientFrom}, ${activeShape.fill.gradientColorTo ?? gradientTo})` }}
                    />
                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="flex items-center space-x-1.5 bg-zinc-900/80 border border-zinc-800/60 rounded-lg px-2 py-1.5">
                        <input
                          type="color"
                          value={activeShape.fill.gradientColorFrom ?? gradientFrom}
                          onChange={(e) => {
                            setGradientFrom(e.target.value);
                            selectedShapes.forEach((shape) => {
                              if (shape.fill) updateShape(shape.id, { fill: { ...shape.fill, gradientColorFrom: e.target.value } });
                            });
                          }}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="text-[9px] text-zinc-500">From</span>
                      </div>
                      <div className="flex items-center space-x-1.5 bg-zinc-900/80 border border-zinc-800/60 rounded-lg px-2 py-1.5">
                        <input
                          type="color"
                          value={activeShape.fill.gradientColorTo ?? gradientTo}
                          onChange={(e) => {
                            setGradientTo(e.target.value);
                            selectedShapes.forEach((shape) => {
                              if (shape.fill) updateShape(shape.id, { fill: { ...shape.fill, gradientColorTo: e.target.value } });
                            });
                          }}
                          className="w-5 h-5 rounded cursor-pointer"
                        />
                        <span className="text-[9px] text-zinc-500">To</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-zinc-600">Angle</span>
                        <span className="text-[10px] font-mono text-zinc-400">{activeShape.fill.gradientAngle ?? gradientAngle}°</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={360}
                        value={activeShape.fill.gradientAngle ?? gradientAngle}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setGradientAngle(val);
                          selectedShapes.forEach((shape) => {
                            if (shape.fill) updateShape(shape.id, { fill: { ...shape.fill, gradientAngle: val } });
                          });
                        }}
                        className="w-full h-1.5 rounded-full accent-indigo-500 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {activeShape.stroke && (
          <div className="border-b border-zinc-800/40 pb-2 mb-1">
            <SectionHeader label="Stroke" open={strokeOpen} toggle={() => setStrokeOpen((v) => !v)} />
            {strokeOpen && (
              <div className="space-y-2 mt-1.5">
                <div className="flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800/60 rounded-lg px-2.5 py-2 hover:border-zinc-700/60 transition-all">
                  <input
                    type="color"
                    value={activeShape.stroke.color.startsWith('#') ? activeShape.stroke.color : '#6366f1'}
                    onChange={(e) => handleStroke('color', e.target.value)}
                    className="w-6 h-6 rounded-md border border-zinc-700/60 cursor-pointer flex-shrink-0"
                  />
                  <span className="font-mono text-zinc-300 uppercase text-[11px] flex-1 truncate">
                    {activeShape.stroke.color}
                  </span>
                  <div className="flex items-center space-x-1 bg-zinc-800/60 rounded px-1.5 py-0.5">
                    <span className="text-[9px] text-zinc-600">W</span>
                    <input
                      type="number"
                      min={0}
                      value={activeShape.stroke.width}
                      onChange={(e) => handleStroke('width', Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-transparent border-none outline-none text-zinc-200 text-[11px] w-7 text-right tabular-nums"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-zinc-600">Stroke Opacity</span>
                    <span className="text-[10px] font-mono text-zinc-400">{Math.round(activeShape.stroke.opacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={Math.round(activeShape.stroke.opacity * 100)}
                    onChange={(e) => handleStroke('opacity', parseInt(e.target.value) / 100)}
                    className="w-full h-1.5 rounded-full accent-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="border-b border-zinc-800/40 pb-2 mb-1">
          <div className="flex items-center justify-between py-1.5">
            <button
              onClick={() => setShadowOpen((v) => !v)}
              className="flex items-center space-x-1.5 group"
            >
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
                Shadow
              </span>
              {shadowOpen
                ? <ChevronDown className="w-3 h-3 text-zinc-600" />
                : <ChevronRight className="w-3 h-3 text-zinc-600" />
              }
            </button>
            <button
              onClick={toggleShadow}
              className={`text-[9px] font-semibold px-2 py-0.5 rounded-md transition-all ${
                hasShadow
                  ? 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/25'
                  : 'bg-zinc-800/60 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {hasShadow ? 'On' : 'Off'}
            </button>
          </div>
          {shadowOpen && hasShadow && (
            <div className="space-y-2 mt-1">
              <div className="flex items-center space-x-2 bg-zinc-900/80 border border-zinc-800/60 rounded-lg px-2.5 py-2">
                <input
                  type="color"
                  value={shadow.color ?? '#000000'}
                  onChange={(e) => handleShadow('color', e.target.value)}
                  className="w-6 h-6 rounded-md border border-zinc-700/60 cursor-pointer flex-shrink-0"
                />
                <span className="font-mono text-zinc-300 uppercase text-[11px] flex-1 truncate">
                  {shadow.color ?? '#000000'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <NumInput label="X" value={shadow.offsetX ?? 0} onChange={(v) => handleShadow('offsetX', v)} />
                <NumInput label="Y" value={shadow.offsetY ?? 4} onChange={(v) => handleShadow('offsetY', v)} />
                <NumInput label="Blur" value={shadow.blur ?? 10} onChange={(v) => handleShadow('blur', Math.max(0, v))} min={0} wide />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-zinc-600">Blur</span>
                  <span className="text-[10px] font-mono text-zinc-400">{shadow.blur ?? 10}px</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  value={shadow.blur ?? 10}
                  onChange={(e) => handleShadow('blur', parseInt(e.target.value))}
                  className="w-full h-1.5 rounded-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>
          )}
          {shadowOpen && !hasShadow && (
            <p className="text-[10px] text-zinc-600 mt-1.5 pl-0.5">
              Click <strong className="text-zinc-500">Off</strong> to enable shadow.
            </p>
          )}
        </div>
        {activeShape.type === ShapeType.TEXT && !isMultiSelect && (
          <div className="border-b border-zinc-800/40 pb-2 mb-1">
            <SectionHeader label="Typography" open={typoOpen} toggle={() => setTypoOpen((v) => !v)} />
            {typoOpen && (
              <div className="space-y-2 mt-1.5">
                <select
                  value={activeShape.fontFamily || 'Inter'}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800/60 rounded-lg p-1.5 text-zinc-200 text-[11px] outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all mb-1.5"
                >
                  {['Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 'Poppins', 'Playfair Display', 'Merriweather', 'Nunito', 'Raleway', 'Ubuntu', 'Rubik', 'Work Sans', 'Quicksand', 'Inconsolata', 'Karla', 'Josefin Sans'].map(font => (
                    <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                  ))}
                </select>
                <textarea
                  value={activeShape.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className="w-full bg-zinc-900/80 border border-zinc-800/60 rounded-lg p-2.5 text-zinc-200 text-[11px] resize-y outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/15 transition-all"
                  rows={3}
                  placeholder="Text content..."
                />
                <div className="grid grid-cols-2 gap-1.5">
                  <NumInput
                    label="Size"
                    value={activeShape.fontSize}
                    onChange={(v) => handleChange('fontSize', Math.max(6, v))}
                    min={6}
                  />
                  <div className="flex bg-zinc-900/80 border border-zinc-800/60 rounded-lg p-0.5 items-center justify-around">
                    {(['left', 'center', 'right'] as const).map((align) => (
                      <button
                        key={align}
                        onClick={() => handleChange('textAlign', align)}
                        className={`p-1.5 rounded transition-all ${
                          activeShape.textAlign === align
                            ? 'bg-zinc-800 text-zinc-200'
                            : 'text-zinc-600 hover:text-zinc-400'
                        }`}
                      >
                        {align === 'left' && <AlignLeft className="w-3 h-3" />}
                        {align === 'center' && <AlignCenter className="w-3 h-3" />}
                        {align === 'right' && <AlignRight className="w-3 h-3" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-1.5 mt-1.5">
                  <NumInput
                    label="Line"
                    value={activeShape.lineHeight ?? Math.round(activeShape.fontSize * 1.2)}
                    onChange={(v) => handleChange('lineHeight', Math.max(0, v))}
                  />
                  <NumInput
                    label="Space"
                    value={activeShape.letterSpacing ?? 0}
                    onChange={(v) => handleChange('letterSpacing', v)}
                  />
                </div>
                <div className="flex items-center space-x-1.5 mt-1.5">
                   <select 
                     value={activeShape.textDecoration || 'none'} 
                     onChange={(e) => handleChange('textDecoration', e.target.value)}
                     className="flex-1 bg-zinc-900/80 border border-zinc-800/60 rounded p-1.5 text-[10px] text-zinc-300 outline-none focus:border-indigo-500/40"
                   >
                     <option value="none">Normal</option>
                     <option value="underline">Underline</option>
                     <option value="line-through">Strikethrough</option>
                   </select>
                   <select 
                     value={activeShape.textTransform || 'none'} 
                     onChange={(e) => handleChange('textTransform', e.target.value)}
                     className="flex-1 bg-zinc-900/80 border border-zinc-800/60 rounded p-1.5 text-[10px] text-zinc-300 outline-none focus:border-indigo-500/40"
                   >
                     <option value="none">Case: As is</option>
                     <option value="uppercase">UPPERCASE</option>
                     <option value="lowercase">lowercase</option>
                     <option value="capitalize">Capitalize</option>
                   </select>
                </div>
                <div className="flex items-center space-x-1 bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-0.5 mt-1.5">
                  {(['300', '400', '600', '700', '800'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => handleChange('fontWeight', w)}
                      className={`flex-1 py-1 text-[9px] rounded transition-all ${
                        activeShape.fontWeight === w
                          ? 'bg-zinc-800 text-zinc-200'
                          : 'text-zinc-600 hover:text-zinc-400'
                      }`}
                      style={{ fontWeight: w }}
                    >
                      {w === '300' ? 'L' : w === '400' ? 'R' : w === '600' ? 'Sb' : w === '700' ? 'B' : 'Xb'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
