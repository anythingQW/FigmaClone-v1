import React from 'react';
import { Sparkles, ArrowRight, Layers, Palette, Users, Globe, Shield, Zap } from 'lucide-react';
interface LandingPageProps {
  onStart: () => void;
}
export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen w-screen bg-[#09090b] text-zinc-100 overflow-x-hidden flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <header className="h-16 border-b border-zinc-800/40 px-8 flex items-center justify-between shrink-0 glass-panel sticky top-0 z-50">
        <div className="flex items-center space-x-2.5">
          <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-[15px] tracking-tight text-zinc-100">Flavor</span>
            <span className="text-[9px] text-indigo-400 font-mono ml-1.5 font-bold uppercase tracking-wider bg-indigo-500/10 px-1.5 py-0.5 rounded">v0.4</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={onStart}
            className="flex items-center space-x-2 px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[12px] font-semibold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02]"
          >
            <span>Launch Editor</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="relative w-full max-w-7xl px-8 pt-24 pb-20 flex flex-col items-center text-center">
          <div className="absolute inset-0 -z-10 flex items-center justify-center">
            <div className="w-[600px] h-[350px] bg-gradient-to-tr from-indigo-600/10 to-purple-600/10 rounded-full blur-[120px] opacity-70" />
            <div className="w-[400px] h-[250px] bg-indigo-500/5 rounded-full blur-[80px] opacity-50 translate-x-24" />
          </div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900/80 border border-zinc-800/80 text-[11px] text-indigo-300 font-semibold mb-6">
            <Zap className="w-3 h-3 text-indigo-400 fill-current" />
            <span>Next Generation Vector Design &amp; Collab Platform</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight max-w-4xl text-zinc-100 leading-[1.1] mb-6">
            Design beautiful interfaces,{' '}
            <span className="text-gradient">collaborate in real-time</span>.
          </h1>
          <p className="text-[14px] sm:text-[16px] text-zinc-400 max-w-2xl leading-relaxed mb-10">
            Flavor is a lightweight, high-performance editor workspace built for modern product developers. Build vector layouts, customize gradients, work instantly with teams.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <button
              onClick={onStart}
              className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-[13px] font-bold transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:scale-[1.02]"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStart}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700/80 text-[13px] font-semibold text-zinc-300 transition-all hover:bg-zinc-850"
            >
              Open Dashboard
            </button>
          </div>
          <div className="w-full max-w-5xl rounded-2xl border border-zinc-800/80 bg-zinc-950/60 p-4 shadow-2xl relative overflow-hidden backdrop-blur-sm">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />
            <div className="flex items-center space-x-1.5 pb-3 border-b border-zinc-900/80 mb-4 px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              <span className="text-[9px] text-zinc-600 font-mono ml-4 select-none">workbench.flavor.design</span>
            </div>
            <div className="aspect-[16/9] w-full rounded-lg bg-zinc-900/60 border border-zinc-900 overflow-hidden flex items-center justify-center relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4">
                <div className="p-4 rounded-full bg-indigo-600/10 border border-indigo-500/15 animate-bounce">
                  <Layers className="w-8 h-8 text-indigo-400" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[13px] font-bold text-zinc-200">Interactive Editor Canvas</p>
                  <p className="text-[11px] text-zinc-500">Vector layouts, precise coordinate adjustments, &amp; realtime synchronization.</p>
                </div>
                <button
                  onClick={onStart}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[12px] font-semibold shadow-lg shadow-indigo-500/20 transition-all"
                >
                  Start Editing
                </button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full border-t border-zinc-900 bg-zinc-950/30 py-20 px-8 flex flex-col items-center">
          <div className="max-w-7xl w-full">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-100">Supercharged vector design toolkit</h2>
              <p className="text-[13px] sm:text-[14px] text-zinc-400">Everything you need to mockup, draw, style, and collaborate at high velocity.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Vector Precision', desc: 'Create rectangles, ellipses, polygon, stars, lines with full geometric transform support.', icon: <Layers className="w-5 h-5 text-indigo-400" /> },
                { title: 'Gradient Engine', desc: 'Craft sleek linear gradients with custom angles, starting colors, and stopping colors easily.', icon: <Palette className="w-5 h-5 text-purple-400" /> },
                { title: 'Team Workspace', desc: 'Group projects, rename categories, manage team spaces, and collaborate simultaneously.', icon: <Users className="w-5 h-5 text-cyan-400" /> },
                { title: 'Real-time Canvas Sync', desc: 'Broadcasting model updates instantly over WebSocket rooms ensuring seamless team presence.', icon: <Globe className="w-5 h-5 text-emerald-400" /> },
                { title: 'Keyboard Optimization', desc: 'Navigate canvas rapidly using standard key shortcuts for drawing tools and zooms.', icon: <Zap className="w-5 h-5 text-amber-400" /> },
                { title: 'Export &amp; Share', desc: 'Generate public sharing workbench URLs or download your canvas design as PNG or JSON.', icon: <Shield className="w-5 h-5 text-rose-400" /> }
              ].map((feat, i) => (
                <div key={i} className="p-6 rounded-2xl bg-zinc-900/35 border border-zinc-800/50 hover:border-zinc-700/60 transition-all hover:bg-zinc-900/50">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-4">
                    {feat.icon}
                  </div>
                  <h3 className="text-[14px] font-bold text-zinc-200 mb-2">{feat.title}</h3>
                  <p className="text-[12px] text-zinc-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="h-16 border-t border-zinc-900 px-8 flex items-center justify-between text-[11px] text-zinc-500 bg-[#09090b] shrink-0">
        <span>&copy; {new Date().getFullYear()} Flavor Design Platform. All rights reserved.</span>
        <div className="flex items-center space-x-4">
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};
