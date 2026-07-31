import React, { useEffect, useState, useRef } from 'react';
import { api, Project } from '../api/client';
import { TEMPLATE_CATALOG, TemplateInfo, Templates } from '../canvas/Templates';
import { useShapesStore } from '../store/useShapesStore';
import {
  Plus, Search, MoreHorizontal, Trash2, Pencil,
  Clock, Layers, FolderOpen, Settings, Star,
  Monitor, Smartphone, PresentationIcon, PenTool, Share2,
  LayoutGrid, ArrowUpRight, Hexagon, ImageIcon, Columns,
  ChevronDown, ChevronRight, Hash, Bookmark, Archive,
  Globe, Palette, Box, Grid3X3, Copy, RotateCcw,
  List, Check, X, Shield, Sparkles, SlidersHorizontal,
} from 'lucide-react';
type SidebarView = 'all' | 'recent' | 'shared' | 'trash' | 'starred';
type ProjectCategory = 'all' | 'web' | 'mobile' | 'presentation' | 'wireframe' | 'social';
type SortOption = 'updatedAt' | 'name' | 'shapeCount';
const DEFAULT_CATEGORIES: { key: ProjectCategory; label: string; icon: React.ReactNode; color: string }[] = [
  { key: 'all', label: 'All Categories', icon: <Grid3X3 className="w-3.5 h-3.5" />, color: 'text-zinc-400' },
  { key: 'web', label: 'Web Design', icon: <Globe className="w-3.5 h-3.5" />, color: 'text-indigo-400' },
  { key: 'mobile', label: 'Mobile', icon: <Smartphone className="w-3.5 h-3.5" />, color: 'text-cyan-400' },
  { key: 'presentation', label: 'Presentations', icon: <PresentationIcon className="w-3.5 h-3.5" />, color: 'text-rose-400' },
  { key: 'wireframe', label: 'Wireframes', icon: <Hexagon className="w-3.5 h-3.5" />, color: 'text-zinc-400' },
  { key: 'social', label: 'Social Media', icon: <ImageIcon className="w-3.5 h-3.5" />, color: 'text-pink-400' },
];
interface HomePageProps {
  onOpenProject: (projectId: string) => void;
  onOpenDocs?: () => void;
}
export const HomePage: React.FC<HomePageProps> = ({ onOpenProject, onOpenDocs }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState<ProjectCategory>('web');
  const [contextMenu, setContextMenu] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{ status: string; uptime: number } | null>(null);
  const [categoryLabels, setCategoryLabels] = useState<Record<string, string>>(() =>
    Object.fromEntries(DEFAULT_CATEGORIES.map((c) => [c.key, c.label]))
  );
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingCategoryValue, setEditingCategoryValue] = useState('');
  const categoryInputRef = useRef<HTMLInputElement>(null);
  const CATEGORIES = DEFAULT_CATEGORIES.map((c) => ({ ...c, label: categoryLabels[c.key] ?? c.label }));
  const [sidebarView, setSidebarView] = useState<SidebarView>('all');
  const [activeCategory, setActiveCategory] = useState<ProjectCategory>('all');
  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [templatesExpanded, setTemplatesExpanded] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('updatedAt');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [renameTarget, setRenameTarget] = useState<{ id: string; name: string } | null>(null);
  const { setShapes } = useShapesStore();
  useEffect(() => {
    if (editingCategory && categoryInputRef.current) {
      categoryInputRef.current.focus();
      categoryInputRef.current.select();
    }
  }, [editingCategory]);
  useEffect(() => {
    loadProjects();
    checkHealth();
  }, []);
  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch {
      console.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };
  const checkHealth = async () => {
    try {
      const health = await api.healthCheck();
      setServerStatus(health);
    } catch {
      setServerStatus(null);
    }
  };
  const handleCreateProject = async (name?: string, category?: ProjectCategory, templateId?: string) => {
    const finalName = name || newProjectName.trim();
    if (!finalName) return;
    const finalCat = (category || newProjectCategory) === 'all' ? 'web' : (category || newProjectCategory);
    try {
      const project = await api.createProject(finalName, finalCat as Project['category'], templateId);
      if (templateId) {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const templateShapes = Templates.load(templateId);
        if (templateShapes.length > 0) {
          const minX = Math.min(...templateShapes.map((s) => s.x));
          const minY = Math.min(...templateShapes.map((s) => s.y));
          const maxX = Math.max(...templateShapes.map((s) => s.x + s.width));
          const maxY = Math.max(...templateShapes.map((s) => s.y + s.height));
          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          const offsetX = vw / 2 - centerX;
          const offsetY = vh / 2 - centerY;
          const centered = templateShapes.map((s) => ({ ...s, x: s.x + offsetX, y: s.y + offsetY }));
          setShapes(centered as typeof templateShapes);
        } else {
          setShapes(templateShapes);
        }
      }
      setProjects((prev) => [project, ...prev]);
      setNewProjectName('');
      setNewProjectCategory('web');
      setShowNewModal(false);
      onOpenProject(project.id);
    } catch {
      console.error('Failed to create project');
    }
  };
  const startEditCategory = (key: string, currentLabel: string) => {
    setEditingCategory(key);
    setEditingCategoryValue(currentLabel);
  };
  const commitEditCategory = () => {
    if (editingCategory && editingCategoryValue.trim()) {
      setCategoryLabels((prev) => ({ ...prev, [editingCategory]: editingCategoryValue.trim() }));
    }
    setEditingCategory(null);
  };
  const handleToggleStar = async (id: string, currentStarred: boolean) => {
    try {
      const updated = await api.updateProject(id, { starred: !currentStarred });
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
    } catch {
      console.error('Failed to update star');
    }
  };
  const handleSoftDelete = async (id: string) => {
    try {
      const updated = await api.updateProject(id, { isTrash: true });
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setContextMenu(null);
    } catch {
      console.error('Failed to move to trash');
    }
  };
  const handleRestore = async (id: string) => {
    try {
      const updated = await api.updateProject(id, { isTrash: false });
      setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
      setContextMenu(null);
    } catch {
      console.error('Failed to restore project');
    }
  };
  const handlePermanentDelete = async (id: string) => {
    try {
      await api.deleteProject(id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      setContextMenu(null);
    } catch {
      console.error('Failed to delete project');
    }
  };
  const handleDuplicate = async (project: Project) => {
    try {
      const dup = await api.createProject(`${project.name} Copy`, project.category);
      setProjects((prev) => [dup, ...prev]);
      setContextMenu(null);
    } catch {
      console.error('Failed to duplicate project');
    }
  };
  const handleSaveRename = async () => {
    if (!renameTarget || !renameTarget.name.trim()) return;
    try {
      const updated = await api.updateProject(renameTarget.id, { name: renameTarget.name.trim() });
      setProjects((prev) => prev.map((p) => (p.id === renameTarget.id ? updated : p)));
      setRenameTarget(null);
      setContextMenu(null);
    } catch {
      console.error('Failed to rename project');
    }
  };
  const getFilteredProjects = () => {
    let list = [...projects];
    if (sidebarView === 'trash') {
      list = list.filter((p) => p.isTrash);
    } else {
      list = list.filter((p) => !p.isTrash);
      if (sidebarView === 'recent') {
        list = list.slice(0, 5);
      } else if (sidebarView === 'starred') {
        list = list.filter((p) => p.starred);
      } else if (sidebarView === 'shared') {
        list = list.filter((p) => p.isShared);
      }
      if (activeCategory !== 'all') {
        list = list.filter((p) => p.category === activeCategory);
      }
    }
    if (searchQuery.trim()) {
      list = list.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    return list.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'shapeCount') return b.shapeCount - a.shapeCount;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  };
  const filteredProjects = getFilteredProjects();
  const activeCount = projects.filter((p) => !p.isTrash).length;
  const starredCount = projects.filter((p) => !p.isTrash && p.starred).length;
  const sharedCount = projects.filter((p) => !p.isTrash && p.isShared).length;
  const trashCount = projects.filter((p) => p.isTrash).length;
  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const formatUptime = (seconds: number) => {
    if (seconds < 60) return `${Math.floor(seconds)}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  };
  const templatesByCategory = TEMPLATE_CATALOG.reduce((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {} as Record<string, TemplateInfo[]>);
  return (
    <div className="flex h-screen w-screen bg-[#09090b] text-zinc-100 overflow-hidden select-none">
      <aside className="w-[260px] border-r border-zinc-800/60 glass-panel flex flex-col shrink-0">
        <div className="px-4 pt-5 pb-3">
          <div className="flex items-center space-x-2.5 mb-5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-[15px] tracking-tight text-zinc-100">Flavor</span>
              <span className="text-[9px] text-zinc-600 font-mono ml-1.5">v0.4</span>
            </div>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-[13px] font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 mb-4"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          <p className="px-2 pt-1 pb-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-600">Workspace</p>
          {[
            { key: 'all' as SidebarView, icon: <FolderOpen className="w-4 h-4" />, label: 'All Projects', count: activeCount },
            { key: 'recent' as SidebarView, icon: <Clock className="w-4 h-4" />, label: 'Recent', count: Math.min(activeCount, 5) },
            { key: 'starred' as SidebarView, icon: <Star className="w-4 h-4 text-amber-400" />, label: 'Starred', count: starredCount },
            { key: 'shared' as SidebarView, icon: <Share2 className="w-4 h-4 text-cyan-400" />, label: 'Shared with me', count: sharedCount },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => { setSidebarView(item.key); setActiveCategory('all'); }}
              className={`w-full flex items-center space-x-2.5 px-2.5 py-[7px] rounded-lg text-[12px] transition-all group ${
                sidebarView === item.key && activeCategory === 'all'
                  ? 'bg-zinc-800/70 text-zinc-200 font-medium'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
              }`}
            >
              {item.icon}
              <span className="flex-1 text-left">{item.label}</span>
              <span className={`text-[10px] font-mono tabular-nums ${
                sidebarView === item.key ? 'text-zinc-400' : 'text-zinc-700 group-hover:text-zinc-600'
              }`}>{item.count}</span>
            </button>
          ))}
          <div className="h-px bg-zinc-800/40 my-2.5" />
          <button
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {categoriesExpanded
              ? <ChevronDown className="w-3 h-3" />
              : <ChevronRight className="w-3 h-3" />
            }
            <span>Categories</span>
          </button>
          {categoriesExpanded && (
            <div className="space-y-0.5 pl-0.5">
              {CATEGORIES.map((cat) => (
                <div key={cat.key} className="group/cat relative">
                  {editingCategory === cat.key ? (
                    <div className="flex items-center space-x-1.5 px-2.5 py-[5px]">
                      <span className={cat.color}>{cat.icon}</span>
                      <input
                        ref={categoryInputRef}
                        value={editingCategoryValue}
                        onChange={(e) => setEditingCategoryValue(e.target.value)}
                        onBlur={commitEditCategory}
                        onKeyDown={(e) => { if (e.key === 'Enter') commitEditCategory(); if (e.key === 'Escape') setEditingCategory(null); }}
                        className="flex-1 bg-zinc-800 border border-indigo-500/40 rounded px-1.5 py-0.5 text-[11px] text-zinc-200 outline-none"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => { setActiveCategory(cat.key); setSidebarView('all'); }}
                      className={`w-full flex items-center space-x-2.5 px-2.5 py-[6px] rounded-lg text-[11px] transition-all ${
                        activeCategory === cat.key && sidebarView === 'all'
                          ? 'bg-zinc-800/50 text-zinc-200 font-medium'
                          : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/20'
                      }`}
                    >
                      <span className={activeCategory === cat.key ? cat.color : 'text-zinc-600'}>{cat.icon}</span>
                      <span className="flex-1 text-left">{cat.label}</span>
                      {cat.key !== 'all' && (
                        <button
                          onClick={(e) => { e.stopPropagation(); startEditCategory(cat.key, cat.label); }}
                          className="opacity-0 group-hover/cat:opacity-100 p-0.5 rounded hover:bg-zinc-700/60 text-zinc-600 hover:text-zinc-400 transition-all"
                        >
                          <Pencil className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="h-px bg-zinc-800/40 my-2.5" />
          <button
            onClick={() => setTemplatesExpanded(!templatesExpanded)}
            className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            {templatesExpanded
              ? <ChevronDown className="w-3 h-3" />
              : <ChevronRight className="w-3 h-3" />
            }
            <span>Templates</span>
            <span className="ml-auto text-[9px] font-mono text-zinc-700">{TEMPLATE_CATALOG.length}</span>
          </button>
          {templatesExpanded && (
            <div className="space-y-2 pl-0.5">
              {Object.entries(templatesByCategory).map(([catKey, templates]) => {
                const catInfo = CATEGORIES.find((c) => c.key === catKey);
                return (
                  <div key={catKey}>
                    <p className="px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-700 flex items-center space-x-1.5">
                      <span className={catInfo?.color || 'text-zinc-600'}>{catInfo?.icon}</span>
                      <span>{catInfo?.label || catKey}</span>
                    </p>
                    <div className="space-y-0.5">
                      {templates.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => handleCreateProject(`${t.name} Project`, t.category, t.id)}
                          className="w-full flex items-center space-x-2.5 px-2.5 py-[5px] rounded-lg text-[11px] text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/30 transition-all group"
                        >
                          <Hash className="w-3 h-3 text-zinc-700 group-hover:text-indigo-400 transition-colors" />
                          <span className="truncate flex-1 text-left">{t.name}</span>
                          <Plus className="w-3 h-3 opacity-0 group-hover:opacity-100 text-indigo-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="h-px bg-zinc-800/40 my-2.5" />
          <button
            onClick={() => setSidebarView('trash')}
            className={`w-full flex items-center space-x-2.5 px-2.5 py-[7px] rounded-lg text-[12px] transition-all ${
              sidebarView === 'trash'
                ? 'bg-zinc-800/70 text-rose-300 font-medium'
                : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span className="flex-1 text-left">Trash</span>
            <span className="text-[10px] font-mono text-zinc-700 tabular-nums">{trashCount}</span>
          </button>
        </div>
        <div className="px-4 pb-4 shrink-0">
          <div className="border-t border-zinc-800/40 pt-3 space-y-1">
            <button
              onClick={onOpenDocs}
              className="w-full flex items-center space-x-2.5 px-2.5 py-[7px] rounded-lg text-[12px] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/30 transition-all font-medium"
            >
              <span>Documentation</span>
            </button>
            <button
              onClick={() => setShowSettingsModal(true)}
              className="w-full flex items-center space-x-2.5 px-2.5 py-[7px] rounded-lg text-[12px] text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30 transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </div>
          {serverStatus && (
            <div className="mt-2.5 px-3 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800/40">
              <div className="flex items-center space-x-2 text-[10px]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-zinc-500">Server online</span>
                <span className="text-zinc-700 ml-auto font-mono">{formatUptime(serverStatus.uptime)}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-zinc-800/40 px-8 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-[17px] font-bold text-zinc-100 flex items-center space-x-2">
              <span>
                {sidebarView === 'all' ? 'All Projects' :
                 sidebarView === 'recent' ? 'Recent Projects' :
                 sidebarView === 'starred' ? 'Starred Projects' :
                 sidebarView === 'shared' ? 'Shared Projects' : 'Trash'}
              </span>
              {activeCategory !== 'all' && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 ring-1 ring-indigo-500/20">
                  {CATEGORIES.find((c) => c.key === activeCategory)?.label}
                </span>
              )}
            </h1>
            <p className="text-[11px] text-zinc-600">{filteredProjects.length} items</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="pl-9 pr-4 py-1.5 w-60 bg-zinc-900/60 border border-zinc-800/60 rounded-lg text-[12px] text-zinc-300 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center space-x-1 bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-0.5">
              <button
                onClick={() => setSortBy('updatedAt')}
                className={`px-2 py-1 text-[10px] font-medium rounded ${
                  sortBy === 'updatedAt' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Date
              </button>
              <button
                onClick={() => setSortBy('name')}
                className={`px-2 py-1 text-[10px] font-medium rounded ${
                  sortBy === 'name' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Name
              </button>
            </div>
            <div className="flex items-center space-x-1 bg-zinc-900/60 border border-zinc-800/60 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded ${viewMode === 'grid' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded ${viewMode === 'list' ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                <span className="text-[12px] text-zinc-600">Loading projects...</span>
              </div>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-14 h-14 rounded-2xl bg-zinc-800/40 flex items-center justify-center mb-4">
                <FolderOpen className="w-6 h-6 text-zinc-600" />
              </div>
              <h3 className="text-[14px] font-semibold text-zinc-400 mb-1">
                {searchQuery ? 'No results found' : 'No projects in this view'}
              </h3>
              <p className="text-[12px] text-zinc-600 mb-4">
                {searchQuery ? 'Try a different search term.' : 'Create a new project or select a different category.'}
              </p>
              {!searchQuery && sidebarView !== 'trash' && (
                <button
                  onClick={() => setShowNewModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[12px] font-medium transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Project</span>
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden hover:border-zinc-700/60 hover:bg-zinc-900/66 transition-all duration-200 cursor-pointer"
                  onClick={() => !project.isTrash && onOpenProject(project.id)}
                >
                  <div className="h-40 bg-gradient-to-br from-zinc-800/30 to-zinc-900/50 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 shimmer-bg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="w-12 h-12 rounded-xl bg-zinc-800/60 flex items-center justify-center">
                      <LayoutGrid className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleStar(project.id, project.starred); }}
                      className={`absolute top-3 left-3 p-1.5 rounded-lg bg-zinc-900/80 backdrop-blur border border-zinc-700/40 transition-all ${
                        project.starred ? 'opacity-100 text-amber-400' : 'opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-zinc-200'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setContextMenu(contextMenu === project.id ? null : project.id);
                        }}
                        className="p-1.5 rounded-lg bg-zinc-900/80 backdrop-blur border border-zinc-700/40 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    {contextMenu === project.id && (
                      <div className="absolute top-12 right-3 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-2xl shadow-black/50 py-1 z-10 min-w-[140px] animate-fade-in">
                        {!project.isTrash ? (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); onOpenProject(project.id); }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                              <ArrowUpRight className="w-3.5 h-3.5" />
                              <span>Open</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDuplicate(project); }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                              <Copy className="w-3.5 h-3.5" />
                              <span>Duplicate</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setRenameTarget({ id: project.id, name: project.name }); }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-zinc-300 hover:bg-zinc-800 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Rename</span>
                            </button>
                            <div className="h-px bg-zinc-800 my-1" />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleSoftDelete(project.id); }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-rose-400 hover:bg-zinc-800 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Move to Trash</span>
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRestore(project.id); }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-emerald-400 hover:bg-zinc-800 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Restore</span>
                            </button>
                            <div className="h-px bg-zinc-800 my-1" />
                            <button
                              onClick={(e) => { e.stopPropagation(); handlePermanentDelete(project.id); }}
                              className="w-full flex items-center space-x-2 px-3 py-2 text-[11px] text-rose-400 hover:bg-zinc-800 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Permanently</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-[13px] font-semibold text-zinc-200 truncate mb-1 group-hover:text-white transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center space-x-3 text-[10px] text-zinc-600">
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(project.updatedAt)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Layers className="w-3 h-3" />
                        <span>{project.shapeCount} layers</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-900/40 border border-zinc-800/50 rounded-2xl overflow-hidden divide-y divide-zinc-800/40">
              {filteredProjects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => !project.isTrash && onOpenProject(project.id)}
                  className="flex items-center px-4 py-3 hover:bg-zinc-800/30 transition-colors cursor-pointer group"
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); handleToggleStar(project.id, project.starred); }}
                    className={`mr-3 text-zinc-600 hover:text-amber-400 transition-colors ${project.starred ? 'text-amber-400' : ''}`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                  <div className="flex-1 truncate">
                    <span className="text-[13px] font-semibold text-zinc-200 group-hover:text-white transition-colors">
                      {project.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-6 text-[11px] text-zinc-500 mr-4">
                    <span className="capitalize">{project.category}</span>
                    <span>{project.shapeCount} layers</span>
                    <span>{formatTime(project.updatedAt)}</span>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSoftDelete(project.id); }}
                    className="p-1 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowNewModal(false)} />
          <div className="relative w-[460px] bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden animate-modal-in p-6">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
            <h2 className="text-[16px] font-bold text-zinc-100 mb-1">New Project</h2>
            <p className="text-[12px] text-zinc-600 mb-5">Give your project a name and select a category.</p>
            <input
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
              placeholder="Project name"
              autoFocus
              className="w-full px-4 py-3 bg-zinc-900/60 border border-zinc-800/60 rounded-xl text-[13px] text-zinc-200 placeholder:text-zinc-700 outline-none focus:border-indigo-500/40 focus:ring-1 focus:ring-indigo-500/20 transition-all mb-4"
            />
            <p className="text-[11px] text-zinc-500 font-medium mb-2.5">Category</p>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {CATEGORIES.filter((c) => c.key !== 'all').map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setNewProjectCategory(cat.key)}
                  className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl border text-[11px] font-medium transition-all ${
                    newProjectCategory === cat.key
                      ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 ring-1 ring-indigo-500/20'
                      : 'border-zinc-800/60 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700/60 bg-zinc-900/30'
                  }`}
                >
                  <span className={newProjectCategory === cat.key ? cat.color : 'text-zinc-600'}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 text-[12px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCreateProject()}
                disabled={!newProjectName.trim()}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-lg text-[12px] font-semibold transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setRenameTarget(null)} />
          <div className="relative w-[380px] bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden animate-modal-in p-5">
            <h3 className="text-[14px] font-bold text-zinc-100 mb-3">Rename Project</h3>
            <input
              type="text"
              value={renameTarget.name}
              onChange={(e) => setRenameTarget({ ...renameTarget, name: e.target.value })}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveRename()}
              autoFocus
              className="w-full px-3.5 py-2 bg-zinc-900/60 border border-zinc-800/60 rounded-xl text-[12px] text-zinc-200 outline-none focus:border-indigo-500/40 transition-all mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setRenameTarget(null)} className="px-3 py-1.5 text-[11px] text-zinc-500 hover:text-zinc-300">
                Cancel
              </button>
              <button onClick={handleSaveRename} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[11px] font-semibold">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowSettingsModal(false)} />
          <div className="relative w-[480px] bg-[#0c0c0e] border border-zinc-800/60 rounded-2xl shadow-2xl overflow-hidden animate-modal-in p-6">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-zinc-800/60">
              <div className="flex items-center space-x-2">
                <Settings className="w-4 h-4 text-indigo-400" />
                <h3 className="text-[15px] font-bold text-zinc-100">Workspace Settings</h3>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-zinc-600 hover:text-zinc-300">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4 text-[12px]">
              <div>
                <label className="text-zinc-400 font-medium block mb-1.5">Workspace Name</label>
                <input
                  type="text"
                  defaultValue="Flavor Team Workspace"
                  className="w-full px-3.5 py-2 bg-zinc-900/60 border border-zinc-800/60 rounded-xl text-zinc-200 outline-none focus:border-indigo-500/40"
                />
              </div>
              <div>
                <label className="text-zinc-400 font-medium block mb-1.5">Default Grid Size</label>
                <select className="w-full px-3.5 py-2 bg-zinc-900/60 border border-zinc-800/60 rounded-xl text-zinc-200 outline-none">
                  <option value="16">16px (Standard Grid)</option>
                  <option value="8">8px (Dense Design System Grid)</option>
                  <option value="24">24px (Coarse Layout Grid)</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 font-medium block mb-1.5">Canvas Render Engine</label>
                <div className="p-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-500 text-[11px] leading-relaxed">
                  HiDPI Retina Scaling (DevicePixelRatio 2.0+), Hardware-accelerated 2D Context enabled.
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-5 mt-5 border-t border-zinc-800/60">
              <button onClick={() => setShowSettingsModal(false)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-[12px] font-semibold">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
