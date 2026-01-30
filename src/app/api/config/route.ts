import { NextResponse } from 'next/server';

/**
 * Runtime config endpoint. Returns API base URL from server env so production
 * uses the URL set at runtime (e.g. in Docker/CI), not the build-time inlined value.
 * Set NEXT_PUBLIC_API_URL or API_URL in the server environment for production.
 */
export async function GET() {
  const apiBaseUrl =
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001';
  return NextResponse.json({ apiBaseUrl });
}
