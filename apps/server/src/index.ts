import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { API_PORT } from '@figma-clone/shared';
import { RealtimeServer } from './websocket/server.js';
const app = express();
app.use(cors());
app.use(express.json());
interface Project {
  id: string;
  name: string;
  category: string;
  starred: boolean;
  isTrash: boolean;
  isShared: boolean;
  thumbnail: string;
  updatedAt: string;
  createdAt: string;
  shapeCount: number;
}
const projects = new Map<string, Project>();
const now = new Date().toISOString();
const seed = [
  { name: 'SaaS Design System', category: 'web', shapeCount: 42, starred: true },
  { name: 'Mobile Banking App', category: 'mobile', shapeCount: 28, starred: true },
  { name: 'Q3 Product Roadmap', category: 'presentation', shapeCount: 15 },
  { name: 'Wireframe Kit v2', category: 'wireframe', shapeCount: 56 },
  { name: 'Instagram Marketing Campaign', category: 'social', shapeCount: 12 },
  { name: 'E-Commerce Checkout Flow', category: 'web', shapeCount: 34, isShared: true },
];
seed.forEach((p, i) => {
  const id = `project_${Date.now()}_${i}`;
  projects.set(id, {
    id,
    name: p.name,
    category: p.category || 'web',
    starred: (p as any).starred || false,
    isTrash: false,
    isShared: (p as any).isShared || false,
    thumbnail: '',
    updatedAt: now,
    createdAt: now,
    shapeCount: p.shapeCount,
  });
});
app.get('/api/projects', (req, res) => {
  const list = Array.from(projects.values()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  res.json({ projects: list });
});
app.post('/api/projects', (req, res) => {
  const { name, category = 'web', templateId } = req.body;
  if (!name || typeof name !== 'string') {
    return res.status(400).json({ error: 'Project name is required' });
  }
  const id = `project_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  const project: Project = {
    id,
    name: name.trim(),
    category,
    starred: false,
    isTrash: false,
    isShared: false,
    thumbnail: '',
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    shapeCount: templateId ? 14 : 0,
  };
  projects.set(id, project);
  res.status(201).json({ project });
});
app.get('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  res.json({ project });
});
app.patch('/api/projects/:id', (req, res) => {
  const project = projects.get(req.params.id);
  if (!project) return res.status(404).json({ error: 'Not found' });
  const body = req.body;
  if (body.name) project.name = body.name.trim();
  if (typeof body.shapeCount === 'number') project.shapeCount = body.shapeCount;
  if (typeof body.starred === 'boolean') project.starred = body.starred;
  if (typeof body.isTrash === 'boolean') project.isTrash = body.isTrash;
  if (body.category) project.category = body.category;
  project.updatedAt = new Date().toISOString();
  projects.set(project.id, project);
  res.json({ project });
});
app.delete('/api/projects/:id', (req, res) => {
  if (!projects.has(req.params.id)) {
    return res.status(404).json({ error: 'Not found' });
  }
  projects.delete(req.params.id);
  res.status(204).end();
});
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});
const httpServer = createServer(app);
const wss = new RealtimeServer(httpServer);
httpServer.listen(API_PORT, () => {
  console.log(`[Flavor] Server ready → http://localhost:${API_PORT}`);
  console.log(`[Flavor] WebSocket ready → ws://localhost:${API_PORT}`);
  console.log(`[Flavor] ${projects.size} seed projects loaded`);
});
