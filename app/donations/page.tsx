'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Donation } from '@/lib/types';
import { lemonSDK } from '@/lib/lemon-sdk-mock';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Wallet, ArrowLeft, Heart, Calendar } from 'lucide-react';

export default function MyDonationsPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await lemonSDK.authenticate();
        
        if (response.success) {
          setAuthenticated(true);
          setAuthError(null);
          loadDonations();
        } else {
          setAuthError(response.error || 'Authentication failed');
        }
      } catch (error) {
        setAuthError('Failed to connect to LemonCash. Please try again later.');
      } finally {
        setAuthLoading(false);
      }
    };

    authenticate();
  }, []);

  const loadDonations = () => {
    // TODO: Implementar almacenamiento y recuperación de donaciones
    // Por ahora retornamos un array vacío
    // Deberías guardar las donaciones cuando se hace un pago exitoso
    setDonations([]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 text-secondary mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Connecting to LemonCash</h2>
            <p className="text-sm text-muted-foreground mt-2">Authenticating your session...</p>
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

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </Link>
            <div className="bg-secondary rounded-lg p-2">
              <Wallet className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Mis Donaciones</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Historial de donaciones</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground text-balance mb-2">
            Mis Donaciones
          </h2>
          <p className="text-sm text-muted-foreground">
            Historial de todas tus donaciones
          </p>
        </div>

        {/* Total Donated Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-secondary" />
              Total Donado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary">${totalDonated.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground mt-2">
              {donations.length} {donations.length === 1 ? 'donación' : 'donaciones'}
            </p>
          </CardContent>
        </Card>

        {/* Donations List */}
        {donations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-lg p-8 max-w-md mx-auto">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No Tienes Donaciones</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Aún no has realizado ninguna donación. ¡Explora proyectos y apoya causas que te interesen!
              </p>
              <Link href="/projects">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  Explorar Proyectos
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {donations.map((donation) => (
              <Card key={donation.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      ${donation.amount.toFixed(2)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(donation.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Proyecto ID</p>
                      <Link 
                        href={`/projects/${donation.projectId}`}
                        className="font-mono text-sm text-secondary hover:underline"
                      >
                        {donation.projectId}
                      </Link>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dirección del Donante</p>
                      <p className="font-mono text-sm">{donation.donorAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Built with LemonCash SDK • Mock mode for development
          </p>
        </div>
      </footer>
    </div>
  );
}

