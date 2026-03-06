/**
 * Ticket / live-chat service base URL. Used by API config and by client components (LiveChat, etc.).
 * Production: public URL so the browser can reach the ticket service. Dev: localhost:8001.
 */
const TICKET_SERVICE_PUBLIC =
  'https://extrahand-platform-ticket-service-backend.apps.extrahand.in';
const TICKET_SERVICE_LOCAL = 'http://localhost:8001';

/** Base URL for the ticket service. Used by /api/config (server) and by client via config response. */
export function getTicketServiceBaseUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? TICKET_SERVICE_PUBLIC
    : TICKET_SERVICE_LOCAL;
}

/** Convert HTTP(S) base URL to WebSocket URL (http -> ws, https -> wss). */
export function getTicketServiceWsUrl(httpBaseUrl: string): string {
  return httpBaseUrl.replace(/^http/, 'ws');
}
