'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserProfile, Project, Donation } from '@/lib/types';
import { getUserProfile, getProjects, getDonations } from '@/lib/storage';
import { initializeDummyData } from '@/lib/dummy-data';
import { authenticate, TransactionResult } from '@/lib/lemon-sdk-mock';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, User, Wallet, Calendar, TrendingUp, Heart, Plus, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myCampaigns, setMyCampaigns] = useState<Project[]>([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);

  useEffect(() => {
    // Inicializar datos dummy si no existen (esto debe ejecutarse primero)
    initializeDummyData();
    
    // Cargar datos del perfil inmediatamente después de inicializar
    // No esperar a la autenticación para mostrar el perfil
    const profileData = getUserProfile();
    if (profileData) {
      setProfile(profileData);
      loadProfileData(profileData);
    }
    
    const doAuthenticate = async () => {
      try {
        const response = await authenticate();
        
        if (response.result === TransactionResult.SUCCESS) {
          setAuthenticated(true);
          setAuthError(null);
          // Recargar datos después de autenticación
          const updatedProfile = getUserProfile();
          if (updatedProfile) {
            setProfile(updatedProfile);
            loadProfileData(updatedProfile);
          }
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

  const loadProfileData = (userProfile?: UserProfile | null) => {
    // Cargar perfil si no se pasó como parámetro
    const profile = userProfile || getUserProfile();
    if (profile) {
      setProfile(profile);

      // Cargar campañas del usuario (simulando que el usuario tiene algunas campañas)
      const allProjects = getProjects();
      // Simular que el usuario creó las primeras 3 campañas
      const userCampaigns = allProjects.slice(0, 3);
      setMyCampaigns(userCampaigns);

      // Cargar donaciones del usuario
      const allDonations = getDonations();
      // Filtrar donaciones que coincidan con la wallet del usuario
      const userDonations = allDonations.filter(
        d => d.donorAddress.toLowerCase() === profile.walletAddress.toLowerCase()
      );
      setMyDonations(userDonations);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="text-center space-y-4">
          <Spinner className="h-12 w-12 text-secondary mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Conectando con LemonCash</h2>
            <p className="text-sm text-muted-foreground mt-2">Autenticando tu sesión...</p>
          </div>
        </div>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive" className="border-destructive/50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {authError}
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => window.location.reload()}
            className="w-full bg-secondary text-black hover:bg-[#00B85C]"
          >
            Reintentar Conexión
          </Button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>No se pudo cargar el perfil</AlertDescription>
        </Alert>
      </div>
    );
  }

  const totalDonated = myDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="min-h-screen bg-background pb-24">
      <main className="px-4 pt-6">
        {/* Header del Perfil */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-secondary" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {profile.username}
              </h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="h-4 w-4" />
                <span className="font-mono text-xs">
                  {profile.walletAddress.slice(0, 6)}...{profile.walletAddress.slice(-4)}
                </span>
              </div>
            </div>
          </div>
          {profile.bio && (
            <p className="text-sm text-muted-foreground mb-4">
              {profile.bio}
            </p>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            <span>Miembro desde {new Date(profile.createdAt).toLocaleDateString('es-AR', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Card className="bg-card border-border/50">
            <CardContent className="pt-4 pb-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary mb-1">
                  {profile.stats.campaignsCreated}
                </p>
                <p className="text-xs text-muted-foreground">Campañas</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="pt-4 pb-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary mb-1">
                  {profile.stats.donationsCount}
                </p>
                <p className="text-xs text-muted-foreground">Aportes</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50">
            <CardContent className="pt-4 pb-3">
              <div className="text-center">
                <div className="flex items-baseline justify-center gap-1 mb-1">
                  <p className="text-xl font-bold text-secondary">
                    ${(totalDonated / 1000).toFixed(0)}k
                  </p>
                  <span className="text-xs text-muted-foreground">USDC</span>
                </div>
                <p className="text-xs text-muted-foreground">Total Aportado</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mis Campañas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Mis Campañas</h2>
            <Link href="/projects/new">
              <Button size="sm" variant="outline" className="h-8">
                <Plus className="h-3.5 w-3.5 mr-1" />
                Nueva
              </Button>
            </Link>
          </div>
          {myCampaigns.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6 pb-6 text-center">
                <Heart className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">No tenés campañas creadas</p>
                <Link href="/projects/new">
                  <Button size="sm" className="bg-secondary text-black hover:bg-[#00B85C]">
                    Crear Primera Campaña
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myCampaigns.map((campaign) => {
                const progress = (campaign.currentAmount / campaign.goalAmount) * 100;
                return (
                  <div key={campaign.id}>
                    <Link href={`/projects/${campaign.id}`}>
                      <Card className="bg-card border-border/50 hover:border-secondary/50 transition-colors">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground mb-1 truncate">
                                {campaign.title}
                              </h3>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <span>{progress.toFixed(0)}% completado</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-sm font-semibold text-secondary">
                                  ${campaign.currentAmount.toFixed(0)}
                                </span>
                                <span className="text-xs text-muted-foreground">USDC</span>
                                <span className="text-xs text-muted-foreground mx-1">/</span>
                                <span className="text-xs text-muted-foreground">
                                  ${campaign.goalAmount.toFixed(0)} USDC
                                </span>
                              </div>
                            </div>
                            <LinkIcon className="h-5 w-5 text-muted-foreground shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mis Aportes Recientes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Aportes Recientes</h2>
            <Link href="/donations/me">
              <Button size="sm" variant="ghost" className="h-8 text-xs">
                Ver todos
              </Button>
            </Link>
          </div>
          {myDonations.length === 0 ? (
            <Card className="bg-card border-border/50">
              <CardContent className="pt-6 pb-6 text-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-4">Aún no realizaste aportes</p>
                <Link href="/projects">
                  <Button size="sm" className="bg-secondary text-black hover:bg-[#00B85C]">
                    Explorar Campañas
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {myDonations.slice(0, 5).map((donation) => (
                <div key={donation.id}>
                  <Link href={`/projects/${donation.projectId}`}>
                    <Card className="bg-card border-border/50 hover:border-secondary/50 transition-colors">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                              <Heart className="h-5 w-5 text-secondary" />
                            </div>
                            <div>
                              <div className="flex items-baseline gap-1">
                                <span className="text-base font-bold text-secondary">
                                  ${donation.amount.toFixed(0)}
                                </span>
                                <span className="text-xs text-muted-foreground">USDC</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(donation.timestamp).toLocaleDateString('es-AR')}
                              </p>
                            </div>
                          </div>
                          <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
