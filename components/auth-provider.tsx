'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authenticate, TransactionResult, isWebView } from '@lemoncash/mini-app-sdk';
import { initializeDummyData } from '@/lib/dummy-data';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
  wallet: string | null;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  loading: true,
  error: null,
  wallet: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData();
    
    const doAuthenticate = async () => {
      try {
        // First check if we have an existing session
        const sessionResponse = await fetch('/api/auth/session');
        
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          if (sessionData.authenticated) {
            setAuthenticated(true);
            setWallet(sessionData.wallet);
            setAuthLoading(false);
            return;
          }
        }
        
        // Check if running in WebView
        if (!isWebView()) {
          setAuthError('Esta aplicación solo funciona dentro de Lemon Cash');
          setAuthLoading(false);
          return;
        }
        
        // Get nonce from backend
        const nonceResponse = await fetch('/api/auth/nonce', {
          method: 'POST',
        });
        
        if (!nonceResponse.ok) {
          throw new Error('Failed to get nonce from backend');
        }
        
        const { nonce } = await nonceResponse.json();
        
        // Authenticate with Lemon SDK using the nonce
        const result = await authenticate({ nonce });
        
        if (result.result === TransactionResult.CANCELLED) {
          setAuthError('Autenticación cancelada');
          setAuthLoading(false);
          return;
        }
        
        if (result.result === TransactionResult.FAILED) {
          setAuthError(result.error?.message || 'Authentication failed');
          setAuthLoading(false);
          return;
        }
        
        const { wallet: userWallet, signature, message } = result.data;
        
        // Verify signature on backend
        const verifyResponse = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet: userWallet,
            signature,
            message,
            nonce,
          }),
        });
        
        if (!verifyResponse.ok) {
          throw new Error('Failed to verify signature');
        }
        
        const verifyData = await verifyResponse.json();
        
        if (!verifyData.verified) {
          throw new Error('Invalid signature');
        }
        
        // Create session on backend
        const sessionCreateResponse = await fetch('/api/auth/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            wallet: userWallet,
          }),
        });
        
        if (!sessionCreateResponse.ok) {
          throw new Error('Failed to create session');
        }
        
        setAuthenticated(true);
        setWallet(userWallet);
        setAuthError(null);
      } catch (error) {
        console.error('Authentication error:', error);
        setAuthError(
          error instanceof Error 
            ? error.message 
            : 'Failed to connect to LemonCash. Please try again later.'
        );
      } finally {
        setAuthLoading(false);
      }
    };

    doAuthenticate();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 text-secondary mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Conectando con Lemon Cash</h2>
            <p className="text-sm text-muted-foreground mt-2">Autenticando tu sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {authError}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
          >
            Reintentar Conexión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ authenticated, loading: authLoading, error: authError, wallet }}>
      {children}
    </AuthContext.Provider>
  );
}

