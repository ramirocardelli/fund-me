import { NextResponse } from 'next/server';
import crypto from 'crypto';

// In production, store nonces in a database with expiration
const nonces = new Map<string, { timestamp: number; used: boolean }>();

export async function POST() {
  try {
    // Generate a cryptographically secure nonce (at least 8 alphanumeric characters)
    const nonce = crypto.randomBytes(32).toString('hex');
    
    // Store nonce with timestamp (expires in 5 minutes)
    nonces.set(nonce, {
      timestamp: Date.now(),
      used: false,
    });
    
    // Clean up expired nonces (older than 5 minutes)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
    for (const [key, value] of nonces.entries()) {
      if (value.timestamp < fiveMinutesAgo) {
        nonces.delete(key);
      }
    }
    
    return NextResponse.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    );
  }
}
