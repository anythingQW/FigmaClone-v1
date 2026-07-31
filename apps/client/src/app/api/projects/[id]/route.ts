import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../server/database';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await db.getProject(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json({ project });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await db.getProject(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  try {
    const body = await req.json();
    const updates: any = {};
    if (body.name) updates.name = body.name.trim();
    if (typeof body.shapeCount === 'number') updates.shapeCount = body.shapeCount;
    if (typeof body.starred === 'boolean') updates.starred = body.starred;
    if (typeof body.isTrash === 'boolean') updates.isTrash = body.isTrash;
    if (body.category) updates.category = body.category;
    
    const updatedProject = await db.updateProject(id, updates);
    return NextResponse.json({ project: updatedProject });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await db.getProject(id);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  await db.deleteProject(id);
  return new NextResponse(null, { status: 204 });
}
