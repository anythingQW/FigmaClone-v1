import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import next from 'next';
import { RealtimeServer } from './src/server/realtime.js';
import { db } from './src/server/database.js';
import crypto from 'crypto';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const port = process.env.PORT || 8080;
app.prepare().then(() => {
  const server = express();
  server.use(cors());
  server.use(express.json());
  server.get('/api/health', (req, res) => {
    res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
  });
  server.get('/api/projects', async (req, res) => {
    const projects = await db.getProjects();
    const list = projects.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    res.json({ projects: list });
  });
  server.post('/api/projects', async (req, res) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      res.status(400).json({ error: 'Project name is required' });
      return;
    }
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const project = {
      id,
      name: name.trim(),
      thumbnail: '',
      updatedAt: now,
      createdAt: now,
      shapeCount: 0,
    };
    await db.createProject(project);
    res.status(201).json({ project });
  });
  server.get('/api/projects/:id', async (req, res) => {
    const project = await db.getProject(req.params.id);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ project });
  });
  server.patch('/api/projects/:id', async (req, res) => {
    const { name, shapeCount, starred, isTrash } = req.body;
    const updates: any = {};
    if (name !== undefined) updates.name = name.trim();
    if (shapeCount !== undefined) updates.shapeCount = shapeCount;
    if (starred !== undefined) updates.starred = starred;
    if (isTrash !== undefined) updates.isTrash = isTrash;
    const project = await db.updateProject(req.params.id, updates);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json({ project });
  });
  server.delete('/api/projects/:id', async (req, res) => {
    await db.deleteProject(req.params.id);
    res.status(204).send();
  });
  server.use((req, res) => {
    return handle(req, res);
  });
  const httpServer = createServer(server);
  new RealtimeServer(httpServer);
  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
