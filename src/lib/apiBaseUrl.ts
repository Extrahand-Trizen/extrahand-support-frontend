/**
 * Articles API = content admin backend. Support API = support backend (auth, contact).
 * On the server uses env directly; in the browser fetches /api/config once at runtime.
 */

let cachedArticles: Promise<string> | null = null;

/** Returns the articles API base URL (content admin backend). */
export function getArticlesApiBaseUrl(): Promise<string> {
  if (typeof window === 'undefined') {
    return Promise.resolve(
      process.env.ARTICLES_API_URL ||
        process.env.NEXT_PUBLIC_ARTICLES_API_URL ||
        'http://localhost:5001'
    );
  }
  if (cachedArticles) return cachedArticles;
  cachedArticles = fetch('/api/config', { cache: 'no-store' })
    .then((r) => r.json())
    .then((d) => d?.articlesApiBaseUrl || 'http://localhost:5001')
    .catch(() => 'http://localhost:5001');
  return cachedArticles;
}

/** @deprecated Use getArticlesApiBaseUrl for articles. Kept for backward compat. */
export function getApiBaseUrl(): Promise<string> {
  return getArticlesApiBaseUrl();
}
