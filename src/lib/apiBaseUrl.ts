/**
 * Returns the API base URL. On the server uses env directly; in the browser
 * fetches /api/config once (which reads server env at runtime) so production
 * gets the correct URL even when NEXT_PUBLIC_API_URL was not set at build time.
 */
let cached: Promise<string> | null = null;

export function getApiBaseUrl(): Promise<string> {
  if (typeof window === 'undefined') {
    return Promise.resolve(
      process.env.NEXT_PUBLIC_API_URL ||
        process.env.API_URL ||
        'http://localhost:5001'
    );
  }
  if (cached) return cached;
  cached = fetch('/api/config', { cache: 'no-store' })
    .then((r) => r.json())
    .then((d) => d?.apiBaseUrl || 'http://localhost:5001')
    .catch(() => 'http://localhost:5001');
  return cached;
}
