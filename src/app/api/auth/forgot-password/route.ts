import { NextResponse } from 'next/server';
import { getSupportBackendBaseUrl } from '@/lib/supportBackendUrl';

export async function POST(request: Request) {
  const BACKEND_URL = getSupportBackendBaseUrl();

  try {
    const body = await request.json();
    const { email } = body;

    // Validate email format
    if (!email || !email.endsWith('@gmail.com')) {
      return NextResponse.json(
        { error: 'Only Gmail addresses are allowed' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    let data: { error?: string; message?: string } = {};
    try {
      const text = await response.text();
      if (text) data = JSON.parse(text);
    } catch {
      console.error('Forgot password: backend returned non-JSON', response.status, response.statusText);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to send reset link' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const err = error as Error & { cause?: { code?: string } };
    console.error('Forgot password proxy error:', err?.message, err?.cause?.code ?? '', 'Backend URL:', BACKEND_URL);
    const isUnreachable =
      err?.cause?.code === 'ECONNREFUSED' ||
      err?.cause?.code === 'ENOTFOUND' ||
      err?.message?.includes('fetch failed');

    return NextResponse.json(
      {
        error: isUnreachable
          ? 'Authentication service is temporarily unavailable. Please try again later.'
          : 'Failed to connect to authentication service',
      },
      { status: 503 }
    );
  }
}
