import React, { useState } from 'react';
import { useShapesStore } from '../store/useShapesStore';
import { Templates, TEMPLATE_CATALOG, TemplateInfo } from '../canvas/Templates';
import {
  X, Sparkles, MousePointer, Layers, Command,
  Monitor, Smartphone, PresentationIcon, PenTool, Share2,
  LayoutGrid, Hexagon, Star, ImageIcon, Columns,
  Rocket,
} from 'lucide-react';
interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'web', label: 'Web' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'presentation', label: 'Slides' },
  { key: 'wireframe', label: 'Wireframe' },
  { key: 'social', label: 'Social' },
];
const TEMPLATE_ICONS: Record<string, React.ReactNode> = {
  'landing': <Monitor className="w-4 h-4" />,
  'dashboard': <LayoutGrid className="w-4 h-4" />,
  'pricing': <Columns className="w-4 h-4" />,
  'mobile-app': <Smartphone className="w-4 h-4" />,
  'mobile-login': <PenTool className="w-4 h-4" />,
  'slide-deck': <PresentationIcon className="w-4 h-4" />,
  'wireframe-web': <Hexagon className="w-4 h-4" />,
  'social-post': <ImageIcon className="w-4 h-4" />,
  'card-components': <Layers className="w-4 h-4" />,
  'onboarding': <Rocket className="w-4 h-4" />,
};
export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { setShapes } = useShapesStore();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  if (!isOpen) return null;
  const handleLoadTemplate = (templateId: string) => {
    const shapes = Templates.load(templateId);
    setShapes(shapes);
    onClose();
  };
  const filtered = activeCategory === 'all'
    ? TEMPLATE_CATALOG
    : TEMPLATE_CATALOG.filter((t) => t.category === activeCategory);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-[720px] max-h-[85vh] bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden animate-modal-in">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
        <div className="px-8 pt-7 pb-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-zinc-300 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-3 mb-1.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-zinc-100">Insert Template</h2>
              <p className="text-[11px] text-zinc-600">Pre-built layouts to accelerate your workflow</p>
            </div>
          </div>
        </div>
        <div className="px-8 pb-3 flex items-center space-x-1.5">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
                activeCategory === cat.key
                  ? 'bg-indigo-500/15 text-indigo-400 ring-1 ring-indigo-500/30'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="px-8 pb-4 grid grid-cols-2 gap-3 max-h-[45vh] overflow-y-auto">
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => handleLoadTemplate(t.id)}
              onMouseEnter={() => setHoveredTemplate(t.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className="group relative text-left p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-700/50 transition-all duration-200"
            >
              <div className={`inline-flex p-2.5 rounded-lg bg-gradient-to-br ${t.gradient} mb-2.5 shadow-lg text-white`}>
                {TEMPLATE_ICONS[t.id] || <Layers className="w-4 h-4" />}
              </div>
              <h3 className="text-[13px] font-semibold text-zinc-200 mb-0.5">{t.name}</h3>
              <p className="text-[10px] text-zinc-600 leading-relaxed">{t.description}</p>
              <div className={`absolute inset-0 rounded-xl ring-2 ring-indigo-500/25 transition-opacity duration-150 pointer-events-none ${
                hoveredTemplate === t.id ? 'opacity-100' : 'opacity-0'
              }`} />
            </button>
          ))}
        </div>
        <div className="px-8 pb-4">
          <button
            onClick={onClose}
            className="w-full p-3.5 rounded-xl border border-dashed border-zinc-800/80 text-zinc-600 hover:text-zinc-300 hover:border-zinc-600 transition-all duration-200 text-sm font-medium flex items-center justify-center space-x-2"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    </div>
  );
};
