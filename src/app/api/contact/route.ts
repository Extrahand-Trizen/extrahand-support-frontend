import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    // Get backend URL from environment - prioritize BACKEND_API_URL for server-side
    // This must be set in CapRover environment variables
    const BACKEND_URL = process.env.BACKEND_API_URL || 
                       process.env.NEXT_PUBLIC_API_URL || 
                       'http://localhost:5001';
    
    const body = await request.json();
    const { name, email, subject, message } = body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Forward the request to the backend
    const backendUrl = `${BACKEND_URL}/api/contact`;
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to submit contact form' },
        { status: response.status }
      );
    }

    // Return the backend response
    return NextResponse.json(data);

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to contact service' },
      { status: 500 }
    );
  }
}
