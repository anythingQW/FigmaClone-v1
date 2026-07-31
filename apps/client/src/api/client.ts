export interface Project {
  id: string;
  name: string;
  category: 'web' | 'mobile' | 'presentation' | 'wireframe' | 'social';
  starred: boolean;
  isTrash: boolean;
  isShared: boolean;
  thumbnail: string;
  updatedAt: string;
  createdAt: string;
  shapeCount: number;
  templateId?: string;
}
export const api = {
  async getProjects(): Promise<Project[]> {
    const res = await fetch('/api/projects');
    const data = await res.json();
    return data.projects;
  },
  async createProject(name: string, category: Project['category'] = 'web', templateId?: string): Promise<Project> {
    const res = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, templateId }),
    });
    const data = await res.json();
    return data.project;
  },
  async updateProject(id: string, updates: Partial<Project>): Promise<Project> {
    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    const data = await res.json();
    return data.project;
  },
  async deleteProject(id: string): Promise<void> {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
  },
  async healthCheck(): Promise<{ status: string; uptime: number }> {
    const res = await fetch('/api/health');
    return res.json();
  },
};
