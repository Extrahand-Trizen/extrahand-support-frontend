import { NextResponse } from 'next/server';

/**
 * Runtime config endpoint. Returns API base URLs from server env.
 * - articlesApiBaseUrl: content admin backend (articles API) – set ARTICLES_API_URL or NEXT_PUBLIC_ARTICLES_API_URL
 * - supportApiBaseUrl: support backend (auth, contact) – set SUPPORT_API_URL or NEXT_PUBLIC_SUPPORT_API_URL
 */
export async function GET() {
  const articlesApiBaseUrl =
    process.env.ARTICLES_API_URL ||
    process.env.NEXT_PUBLIC_ARTICLES_API_URL ||
    'http://localhost:5001';
  const supportApiBaseUrl =
    process.env.SUPPORT_API_URL ||
    process.env.NEXT_PUBLIC_SUPPORT_API_URL ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001';
  return NextResponse.json({
    articlesApiBaseUrl,
    supportApiBaseUrl,
  });
}
