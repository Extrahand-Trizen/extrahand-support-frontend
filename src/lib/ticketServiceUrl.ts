/**
 * Ticket / live-chat service base URL. Same pattern as supportBackendUrl – use variable, not env.
 * Production: public URL. Dev: localhost:8001. Used by LiveChat, InquiryForm, contact, /api/config.
 */
const TICKET_SERVICE_PUBLIC =
  'https://extrahand-ticket-service-backend.apps.extrahand.in';
const TICKET_SERVICE_LOCAL = 'http://localhost:8001';

/** Base URL for the ticket service (prod URL in production build, localhost in dev). */
export function getTicketServiceBaseUrl(): string {
  return process.env.NODE_ENV === 'production'
    ? TICKET_SERVICE_PUBLIC
    : TICKET_SERVICE_LOCAL;
}

/** Convert HTTP(S) base URL to WebSocket URL (http -> ws, https -> wss). */
export function getTicketServiceWsUrl(httpBaseUrl: string): string {
  return httpBaseUrl.replace(/^http/, 'ws');
}
