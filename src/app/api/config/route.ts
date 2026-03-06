import { NextResponse } from 'next/server';
import { getSupportBackendBaseUrl } from '@/lib/supportBackendUrl';
import { getTicketServiceBaseUrl } from '@/lib/ticketServiceUrl';

/**
 * Config endpoint. articlesApiBaseUrl from env; supportApiBaseUrl and ticketServiceBaseUrl from fixed URLs.
 * Use ?check=backend to probe support backend reachability.
 */
export async function GET(request: Request) {
  const articlesApiBaseUrl =
    process.env.ARTICLES_API_URL ||
    process.env.NEXT_PUBLIC_ARTICLES_API_URL ||
    'http://localhost:5001';
  const supportApiBaseUrl = getSupportBackendBaseUrl();
  const ticketServiceBaseUrl = getTicketServiceBaseUrl();

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
    ticketServiceBaseUrl,
    ...(supportBackendReachable !== null && {
      supportBackendReachable,
      ...(supportBackendError && { supportBackendError }),
    }),
  });
}
