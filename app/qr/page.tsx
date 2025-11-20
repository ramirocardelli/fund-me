'use client';

import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { XCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ScanQRPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleScan = (result: any) => {
    if (result && result.length > 0) {
      const data = result[0].rawValue;
      
      // Try to redirect to the URL
      try {
        // Check if it's a valid URL
        const url = new URL(data);
        window.location.href = url.href;
      } catch (e) {
        // If not a valid URL, try to navigate within the app
        router.push(data);
      }
    }
  };

  const handleError = (error: any) => {
    console.error('QR Scanner Error:', error);
    setError('Error al acceder a la cámara. Por favor verificá los permisos.');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-card border-b border-border">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Escanear QR</h1>
          <p className="text-xs text-muted-foreground">
            Apuntá la cámara al código QR
          </p>
        </div>
      </div>

      {/* Scanner */}
      <div className="relative h-[calc(100vh-80px)] bg-black">
        <Scanner
          onScan={handleScan}
          onError={handleError}
          constraints={{
            facingMode: 'environment',
          }}
          styles={{
            container: {
              width: '100%',
              height: '100%',
            },
          }}
        />

        {/* Scanner Frame Overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-64 h-64 border-2 border-secondary rounded-lg">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-secondary rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-secondary rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-secondary rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-secondary rounded-br-lg" />
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="absolute bottom-6 left-4 right-4">
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </div>
  );
}
