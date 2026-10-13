import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET() {
  const version = (process.env.NEXT_PUBLIC_WEB_VERSION ?? '1.0.0')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .trim();

  const swPath = path.join(process.cwd(), 'public', 'firebase-messaging-sw.js');
  let swContent = fs.readFileSync(swPath, 'utf-8');

  swContent = swContent.replace(
    /const CACHE_VERSION = '[^']*';/,
    `const CACHE_VERSION = '${version}';`
  );

  return new NextResponse(swContent, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Service-Worker-Allowed': '/',
    },
  });
}
