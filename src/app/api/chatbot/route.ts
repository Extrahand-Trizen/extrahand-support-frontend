import { NextRequest, NextResponse } from 'next/server';

const CHATBOT_API_URL = process.env.CHATBOT_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Forward request to chatbot service
    const response = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId || 'default',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || 'Chatbot service error' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      response: data.response || data.message || 'I apologize, but I could not generate a response.',
      sources: data.sources || [],
      action: data.action,
    });
  } catch (error: any) {
    console.error('Chatbot API error:', error);
    
    // Check if chatbot service is unreachable
    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'Chatbot service is not running. Please start the chatbot service.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process chatbot request. Please try again.' },
      { status: 500 }
    );
  }
}
