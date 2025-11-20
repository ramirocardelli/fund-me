import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('lemon_session');
    
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }
    
    // In production, verify session token in database
    const sessionData = JSON.parse(session.value);
    
    return NextResponse.json({
      authenticated: true,
      wallet: sessionData.wallet,
    });
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet } = body;
    
    if (!wallet) {
      return NextResponse.json(
        { error: 'Missing wallet address' },
        { status: 400 }
      );
    }
    
    // Create session
    const sessionData = {
      wallet,
      createdAt: Date.now(),
    };
    
    const response = NextResponse.json({
      success: true,
      wallet,
    });
    
    // Set secure cookie (7 days expiration)
    response.cookies.set('lemon_session', JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Error creating session:', error);
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const response = NextResponse.json({ success: true });
    
    // Delete session cookie
    response.cookies.delete('lemon_session');
    
    return response;
  } catch (error) {
    console.error('Error deleting session:', error);
    return NextResponse.json(
      { error: 'Failed to delete session' },
      { status: 500 }
    );
  }
}
