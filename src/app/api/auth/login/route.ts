import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

export async function POST(request: Request) {
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

    // Forward the request to the backend
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
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
