'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CreateProjectForm } from '@/components/create-project-form';
import { authenticate, TransactionResult } from '@/lib/lemon-sdk-mock';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function NewProjectPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
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

  const handleSuccess = () => {
    router.push('/projects');
  };

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
            Retry Connection
          </Button>
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-background pb-24">
        <main className="px-4 pt-6">
          <div className="max-w-2xl mx-auto">
            <CreateProjectForm
              onSuccess={handleSuccess}
              onCancel={() => router.push('/projects')}
            />
          </div>
        </main>
      </div>
    );
  }

