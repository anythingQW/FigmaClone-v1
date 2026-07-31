import { NextResponse } from 'next/server';
let startTime = Date.now();
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    uptime: (Date.now() - startTime) / 1000,
    timestamp: new Date().toISOString()
  });
}
