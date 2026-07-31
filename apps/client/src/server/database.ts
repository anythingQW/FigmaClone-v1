import fs from 'fs/promises';
import path from 'path';
export interface ProjectData {
  id: string;
  name: string;
  thumbnail: string;
  updatedAt: string;
  createdAt: string;
  shapeCount: number;
  starred?: boolean;
  isTrash?: boolean;
  isShared?: boolean;
  category?: string;
}
export interface DatabaseSchema {
  projects: Record<string, ProjectData>;
  shapes: Record<string, any[]>;
}
const DB_FILE = path.join(process.cwd(), 'data.json');
let dbCache: DatabaseSchema | null = null;
async function ensureDb(): Promise<DatabaseSchema> {
  if (dbCache) return dbCache;
  try {
    const content = await fs.readFile(DB_FILE, 'utf-8');
    dbCache = JSON.parse(content);
    return dbCache!;
  } catch (err) {
    dbCache = { projects: {}, shapes: {} };
    await saveDb();
    return dbCache;
  }
}
async function saveDb(): Promise<void> {
  if (!dbCache) return;
  await fs.writeFile(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
}
export const db = {
  getProjects: async (): Promise<ProjectData[]> => {
    const data = await ensureDb();
    return Object.values(data.projects);
  },
  getProject: async (id: string): Promise<ProjectData | null> => {
    const data = await ensureDb();
    return data.projects[id] || null;
  },
  createProject: async (project: ProjectData): Promise<void> => {
    const data = await ensureDb();
    data.projects[project.id] = project;
    data.shapes[project.id] = [];
    await saveDb();
  },
  updateProject: async (id: string, updates: Partial<ProjectData>): Promise<ProjectData | null> => {
    const data = await ensureDb();
    if (!data.projects[id]) return null;
    data.projects[id] = { ...data.projects[id], ...updates, updatedAt: new Date().toISOString() };
    await saveDb();
    return data.projects[id];
  },
  deleteProject: async (id: string): Promise<void> => {
    const data = await ensureDb();
    delete data.projects[id];
    delete data.shapes[id];
    await saveDb();
  },
  getShapes: async (projectId: string): Promise<any[]> => {
    const data = await ensureDb();
    return data.shapes[projectId] || [];
  },
  saveShapes: async (projectId: string, shapes: any[]): Promise<void> => {
    const data = await ensureDb();
    data.shapes[projectId] = shapes;
    if (data.projects[projectId]) {
      data.projects[projectId].shapeCount = shapes.length;
      data.projects[projectId].updatedAt = new Date().toISOString();
    }
    await saveDb();
  }
};
