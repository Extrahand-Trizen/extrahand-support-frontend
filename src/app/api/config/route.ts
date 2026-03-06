import { NextResponse } from 'next/server';

/**
 * Runtime config endpoint. Returns API base URLs from server env.
 * These values are read at RUNTIME when the server handles the request (not at Docker
 * build time). Set BACKEND_API_URL (and optionally others) in your deployment platform
 * (e.g. CapRover App Config → Environmental Variables) when the container RUNS.
 *
 * - articlesApiBaseUrl: content admin backend (articles API)
 * - supportApiBaseUrl: support backend (auth, contact) – used by signup/login/contact
 * - supportBackendReachable: result of probing GET /health (use ?check=backend)
 */
export async function GET(request: Request) {
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

  let supportBackendReachable: boolean | null = null;
  let supportBackendError: string | null = null;

  const url = new URL(request.url);
  if (url.searchParams.get('check') === 'backend') {
    try {
      const res = await fetch(`${supportApiBaseUrl.replace(/\/$/, '')}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });
      supportBackendReachable = res.ok;
      if (!res.ok) {
        supportBackendError = `HTTP ${res.status}`;
      }
    } catch (err: unknown) {
      const e = err as Error & { cause?: { code?: string } };
      supportBackendReachable = false;
      supportBackendError = e?.cause?.code || e?.message || String(err);
    }
  }

  return NextResponse.json({
    articlesApiBaseUrl,
    supportApiBaseUrl,
    ...(supportBackendReachable !== null && {
      supportBackendReachable,
      ...(supportBackendError && { supportBackendError }),
    }),
  });
}
