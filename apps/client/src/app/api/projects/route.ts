import { NextRequest, NextResponse } from 'next/server';
import { db, ProjectData } from '../../../server/database';
import { Project } from '../../../api/client';
import crypto from 'crypto';

export async function GET() {
  const list = await db.getProjects();
  list.sort(
    (a: ProjectData, b: ProjectData) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  return NextResponse.json({ projects: list });
}

export async function POST(req: NextRequest) {
  try {
    const { name, category = 'web', templateId } = await req.json();
    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Project name is required' }, { status: 400 });
    }
    const id = crypto.randomUUID();
    const now = new Date().toISOString();
    const project: Project = {
      id,
      name: name.trim(),
      category: category as Project['category'],
      starred: false,
      isTrash: false,
      isShared: false,
      thumbnail: '',
      updatedAt: now,
      createdAt: now,
      shapeCount: templateId ? 14 : 0,
      templateId,
    };
    await db.createProject(project);
    return NextResponse.json({ project }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}
