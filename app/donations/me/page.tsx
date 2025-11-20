'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Donation } from '@/lib/types';
import { getDonations } from '@/lib/storage';
import { Spinner } from '@/components/ui/spinner';
import { AlertCircle, Heart, Calendar, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function MyDonationsPage() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = () => {
    const allDonations = getDonations();
    setDonations(allDonations);
    setLoading(false);
  };

  if (loading) {
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

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0);

    return (
      <div className="min-h-screen bg-background pb-24">
        <main className="px-4 pt-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Mis Aportes
            </h1>
            <p className="text-sm text-muted-foreground">
              Historial de tus aportes
            </p>
          </div>

        {/* Total Donado Card */}
        <Card className="mb-6 bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Heart className="h-4 w-4 text-secondary" />
              Total Aportado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-secondary">
                ${totalDonated.toLocaleString('es-AR', { maximumFractionDigits: 0 })}
              </p>
              <span className="text-sm text-muted-foreground">USDC</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {donations.length} {donations.length === 1 ? 'aporte' : 'aportes'}
            </p>
          </CardContent>
        </Card>

        {/* Donations List */}
        {donations.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm mx-auto">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No tenés aportes</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Explorá campañas y apoyá causas que te interesen
              </p>
              <Link href="/projects">
                <Button className="bg-secondary text-black hover:bg-[#00B85C]">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Explorar Campañas
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {donations.map((donation) => (
              <Card key={donation.id} className="bg-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-secondary">
                      ${donation.amount.toLocaleString('es-AR', { maximumFractionDigits: 0 })} USDC
                    </CardTitle>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>{new Date(donation.timestamp).toLocaleDateString('es-AR')}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link 
                    href={`/projects/${donation.projectId}`}
                    className="text-sm text-secondary hover:underline font-medium"
                  >
                    Ver campaña →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

