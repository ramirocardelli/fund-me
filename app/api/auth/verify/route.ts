import { NextRequest, NextResponse } from 'next/server';

// This would normally use viem's verifySiweMessage
// For now, we'll do basic validation since we're in development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { wallet, signature, message, nonce } = body;
    
    // Validate required fields
    if (!wallet || !signature || !message || !nonce) {
      return NextResponse.json(
        { verified: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // In production, you would:
    // 1. Verify the nonce exists in database and hasn't been used
    // 2. Verify the nonce matches the one in the message
    // 3. Verify the nonce hasn't expired
    // 4. Use viem's verifySiweMessage to verify the signature
    // 5. Mark the nonce as used
    
    // For development with mock SDK, we'll just validate the format
    if (!wallet.startsWith('0x') || wallet.length !== 42) {
      return NextResponse.json(
        { verified: false, error: 'Invalid wallet address' },
        { status: 400 }
      );
    }
    
    if (!signature.startsWith('0x')) {
      return NextResponse.json(
        { verified: false, error: 'Invalid signature format' },
        { status: 400 }
      );
    }
    
    // TODO: In production, uncomment this and install viem:
    /*
    import { createPublicClient, http } from 'viem';
    import { polygon } from 'viem/chains';
    
    const publicClient = createPublicClient({
      chain: polygon,
      transport: http()
    });
    
    const isValid = await publicClient.verifySiweMessage({
      message: message,
      signature: signature as `0x${string}`,
      address: wallet as `0x${string}`,
    });
    
    if (!isValid) {
      return NextResponse.json(
        { verified: false, error: 'Invalid signature' },
        { status: 401 }
      );
    }
    */
    
    // For development, accept all valid-format signatures
    return NextResponse.json({
      verified: true,
      wallet,
    });
    
  } catch (error) {
    console.error('Error verifying signature:', error);
    return NextResponse.json(
      { verified: false, error: 'Verification failed' },
      { status: 500 }
    );
  }
}
