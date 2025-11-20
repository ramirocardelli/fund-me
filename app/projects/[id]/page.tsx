'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FundProjectDialog } from '@/components/fund-project-dialog';
import { ShareButton } from '@/components/share-button';
import { Project } from '@/lib/types';
import { getProjectById } from '@/lib/storage';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, TrendingUp, Calendar, User } from 'lucide-react';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [showFundDialog, setShowFundDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProject();
  }, [projectId]);

  const loadProject = () => {
    const foundProject = getProjectById(projectId);
    setProject(foundProject || null);
    setLoading(false);
  };

  const handleFundSuccess = () => {
    loadProject();
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

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-4 text-center">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              Campaña no encontrada
            </AlertDescription>
          </Alert>
          <Link href="/projects">
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Volver a Campañas
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const progress = (project.currentAmount / project.goalAmount) * 100;
  const remaining = project.goalAmount - project.currentAmount;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    return (
      <div className="min-h-screen bg-background pb-24">
        <main className="px-4 pt-6">
          {/* Project Header */}
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-2xl font-bold text-foreground flex-1">
                {project.title}
              </h1>
              <ShareButton 
                url={currentUrl}
                title={project.title}
                description={project.description}
              />
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{project.creatorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* Progress Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progreso de Recaudación</span>
                <span className="text-2xl font-bold text-secondary">
                  {progress.toFixed(1)}%
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Progress value={progress} className="h-3" />
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Recaudado</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">${project.currentAmount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                    <span className="text-sm text-muted-foreground">USDC</span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Meta</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold">${project.goalAmount.toLocaleString('es-AR', { maximumFractionDigits: 0 })}</p>
                    <span className="text-sm text-muted-foreground">USDC</span>
                  </div>
                </div>
              </div>
              {remaining > 0 && (
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-2">
                    Faltan ${remaining.toLocaleString('es-AR', { maximumFractionDigits: 0 })} USDC para alcanzar la meta
                  </p>
                  <Button
                    onClick={() => setShowFundDialog(true)}
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Fondear Campaña
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description Card */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-line">
                {project.description}
              </p>
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Información del Creador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium">{project.creatorName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Dirección</p>
                  <p className="font-mono text-sm break-all">
                    {project.creatorAddress.slice(0, 6)}...{project.creatorAddress.slice(-4)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>

      {/* Fund Dialog */}
      <FundProjectDialog
        project={project}
        open={showFundDialog}
        onOpenChange={setShowFundDialog}
        onSuccess={handleFundSuccess}
      />

    </div>
  );
}

