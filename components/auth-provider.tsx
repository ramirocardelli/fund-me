'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { authenticate, TransactionResult } from '@/lib/lemon-sdk-mock';
import { initializeDummyData } from '@/lib/dummy-data';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface AuthContextType {
  authenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  authenticated: false,
  loading: true,
  error: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Initialize dummy data
    initializeDummyData();
    
    const doAuthenticate = async () => {
      try {
        const response = await authenticate();
        
        if (response.result === TransactionResult.SUCCESS) {
          setAuthenticated(true);
          setAuthError(null);
        } else {
          setAuthError(response.result || 'Authentication failed');
        }
      } catch (error) {
        setAuthError('Failed to connect to LemonCash. Please try again later.');
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
            <h2 className="text-xl font-semibold text-foreground">Cargando</h2>
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
    <AuthContext.Provider value={{ authenticated, loading: authLoading, error: authError }}>
      {children}
    </AuthContext.Provider>
  );
}
