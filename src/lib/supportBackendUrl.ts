/**
 * Support backend base URL (auth, contact). Used by API routes that proxy to the backend.
 * Production uses the internal service URL; local development honors the frontend env.
 */
const SUPPORT_BACKEND_INTERNAL =
  'http://srv-captain--extrahand-support-backend:5001';
const SUPPORT_BACKEND_LOCAL =
  process.env.SUPPORT_API_URL ||
  process.env.NEXT_PUBLIC_SUPPORT_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5002';

export function getSupportBackendBaseUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? SUPPORT_BACKEND_INTERNAL
    : SUPPORT_BACKEND_LOCAL;
}
