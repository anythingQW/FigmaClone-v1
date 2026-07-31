import { Project } from '../../api/client';
import crypto from 'crypto';
if (!(global as any).projectDb) {
  const db = new Map<string, Project>();
  const now = new Date().toISOString();
  const seed: { name: string; category: Project['category']; shapeCount: number; starred?: boolean; isShared?: boolean }[] = [
    { name: 'SaaS Design System', category: 'web', shapeCount: 42, starred: true },
    { name: 'Mobile Banking App', category: 'mobile', shapeCount: 28, starred: true },
    { name: 'Q3 Product Roadmap', category: 'presentation', shapeCount: 15 },
    { name: 'Wireframe Kit v2', category: 'wireframe', shapeCount: 56 },
    { name: 'Instagram Marketing Campaign', category: 'social', shapeCount: 12 },
    { name: 'E-Commerce Checkout Flow', category: 'web', shapeCount: 34, isShared: true },
  ];
  seed.forEach((p) => {
    const id = crypto.randomUUID();
    db.set(id, {
      id,
      name: p.name,
      category: p.category,
      starred: p.starred || false,
      isTrash: false,
      isShared: p.isShared || false,
      thumbnail: '',
      updatedAt: now,
      createdAt: now,
      shapeCount: p.shapeCount,
    });
  });
  (global as any).projectDb = db;
}
export const projectDb = (global as any).projectDb as Map<string, Project>;
