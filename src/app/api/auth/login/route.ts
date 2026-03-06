import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // Support backend URL (auth, contact) – must be reachable from the Next.js server
  const BACKEND_URL =
    process.env.SUPPORT_API_URL ||
    process.env.NEXT_PUBLIC_SUPPORT_API_URL ||
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5001';

  try {
    
    const body = await request.json();
    const { email, password } = body;

    // Validate email format
    if (!email || !email.endsWith('@gmail.com')) {
      return NextResponse.json(
        { error: 'Only Gmail addresses are allowed' },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    let data: { error?: string; message?: string; user?: unknown; accessToken?: string } = {};
    try {
      const text = await response.text();
      if (text) data = JSON.parse(text);
    } catch {
      console.error('Login: backend returned non-JSON', response.status, response.statusText);
    }

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Invalid email or password' },
        { status: response.status }
      );
    }

    // Return the backend response
    return NextResponse.json(data);

  } catch (error: unknown) {
    const err = error as Error & { cause?: { code?: string } };
    console.error('Login proxy error:', err?.message, err?.cause?.code ?? '', 'Backend URL:', BACKEND_URL);
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
