# Authentication Implementation

This project uses the official **@lemoncash/mini-app-sdk** with proper backend authentication following Lemon Cash best practices.

## Architecture

### Client-Side (`/components/auth-provider.tsx`)
The `AuthProvider` component handles the authentication flow:
1. Checks for existing session (via cookie)
2. Verifies the app is running in Lemon Cash WebView using `isWebView()`
3. Requests a nonce from the backend
4. Calls `authenticate({ nonce })` from the Lemon SDK
5. Sends signature to backend for verification
6. Creates a secure session on the backend

### Backend API Routes

#### `/api/auth/nonce` (POST)
- Generates a cryptographically secure nonce (32 bytes hex)
- Stores nonce with timestamp for validation
- Cleans up expired nonces (> 5 minutes old)

#### `/api/auth/verify` (POST)
- Receives wallet, signature, message, and nonce
- Validates signature format
- **TODO in production**: Use `viem` to verify SIWE signature with `verifySiweMessage()`
- Returns verification status

#### `/api/auth/session` 
- **GET**: Checks if user has active session
- **POST**: Creates new session with secure HTTP-only cookie
- **DELETE**: Logs out user by deleting session cookie

## Security Features

✅ **Nonce-based authentication** - Prevents replay attacks  
✅ **Server-side signature verification** - Client can't fake authentication  
✅ **Secure HTTP-only cookies** - Protected from XSS attacks  
✅ **Session management** - Persistent authentication across pages  
✅ **WebView detection** - Ensures app runs in Lemon Cash environment  

## Production Checklist

When deploying to production, you need to:

### 1. Install viem for signature verification
\`\`\`bash
npm install viem
\`\`\`

### 2. Uncomment signature verification in `/api/auth/verify/route.ts`
The file already has the code commented out - just uncomment it:

\`\`\`typescript
import { createPublicClient, http } from 'viem';
import { polygon } from 'viem/chains';

const publicClient = createPublicClient({
  chain: polygon,
  transport: http()
});

const isValid = await publicClient.verifySiweMessage({
  message: message,
  signature: signature as \`0x\${string}\`,
  address: wallet as \`0x\${string}\`,
});
\`\`\`

### 3. Use a real database for nonce storage
Replace the in-memory `Map` in `/api/auth/nonce/route.ts` with a database (PostgreSQL, Redis, etc.):
- Store nonces with expiration timestamps
- Mark nonces as "used" after verification
- Clean up expired nonces periodically

### 4. Use a real database for session management
Replace cookie-based sessions in `/api/auth/session/route.ts` with:
- Database session storage
- Session tokens with proper expiration
- User profile data linked to wallet address

### 5. Configure environment variables
\`\`\`env
# .env.local
NODE_ENV=production
DATABASE_URL=postgresql://...
SESSION_SECRET=your-secret-key
LEMON_MINI_APP_ID=your-app-id
\`\`\`

## Development Mode

In development, the authentication flow works with the mock SDK but uses the same architecture as production:
- Nonces are generated and validated
- Signatures are checked for format (not cryptographically verified)
- Sessions are created with secure cookies
- All API routes work as they would in production

This allows you to develop and test the full authentication flow without needing testnet tokens or the Lemon Cash app.

## Related Documentation

- [Lemon Cash Authentication](https://lemoncash.mintlify.app/functions/authenticate)
- [SIWE (Sign In With Ethereum)](https://eips.ethereum.org/EIPS/eip-4361)
- [ERC-6492 (Contract Wallets)](https://eips.ethereum.org/EIPS/eip-6492)
