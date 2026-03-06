/**
 * Support backend base URL (auth, contact). Used by API routes that proxy to the backend.
 * Not read from env – fixed URL so it works in Docker/CapRover without runtime env.
 */
const SUPPORT_BACKEND_INTERNAL =
  'http://srv-captain--extrahand-support-backend:5001';
const SUPPORT_BACKEND_LOCAL = 'http://localhost:5001';

export function getSupportBackendBaseUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? SUPPORT_BACKEND_INTERNAL
    : SUPPORT_BACKEND_LOCAL;
}
