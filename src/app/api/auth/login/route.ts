import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Support backend URL (auth, contact) – not the content admin / articles backend
    const BACKEND_URL =
      process.env.SUPPORT_API_URL ||
      process.env.NEXT_PUBLIC_SUPPORT_API_URL ||
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5001';
    
    // Log for debugging (remove in production if needed)
    console.log('Backend URL:', BACKEND_URL);
    
    const body = await request.json();
    const { email, password } = body;

    // Validate email format
    if (!email || !email.endsWith('@gmail.com')) {
      return NextResponse.json(
        { error: 'Only Gmail addresses are allowed' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const backendUrl = `${BACKEND_URL}/api/auth/login`;
    console.log('Forwarding login request to:', backendUrl);
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Invalid email or password' },
        { status: response.status }
      );
    }

    // Return the backend response
    return NextResponse.json(data);

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to authentication service' },
      { status: 500 }
    );
  }
}
