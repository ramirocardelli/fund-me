'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/project-card';
import { FundProjectDialog } from '@/components/fund-project-dialog';
import { authenticate, TransactionResult } from '@/lib/lemon-sdk-mock';
import { getProjects } from '@/lib/storage';
import { initializeDummyData } from '@/lib/dummy-data';
import { Project } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Heart } from 'lucide-react';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFundDialog, setShowFundDialog] = useState(false);

  useEffect(() => {
    // Inicializar datos dummy si no existen
    initializeDummyData();
    
    const doAuthenticate = async () => {
      try {
        const response = await authenticate();
        
        if (response.result === TransactionResult.SUCCESS) {
          setAuthenticated(true);
          setAuthError(null);
          loadProjects();
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

  const loadProjects = () => {
    setProjects(getProjects());
  };

  const handleFundProject = (project: Project) => {
    setSelectedProject(project);
    setShowFundDialog(true);
  };

  const handleFundSuccess = () => {
    loadProjects();
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
            className="w-full bg-secondary text-black hover:bg-secondary"
          >
            Reintentar Conexión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <main className="px-4 pt-6">
        {/* Título simple */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Campañas
          </h1>
          <p className="text-sm text-muted-foreground">
            Apoyá campañas increíbles
          </p>
        </div>

        {/* Lista de Campañas */}
        {projects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm mx-auto">
              <div className="bg-secondary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No hay campañas</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Sé el primero en crear una campaña
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onFund={handleFundProject}
              />
            ))}
          </div>
        )}
      </main>

      {/* Fund Dialog */}
      <FundProjectDialog
        project={selectedProject}
        open={showFundDialog}
        onOpenChange={setShowFundDialog}
        onSuccess={handleFundSuccess}
      />
    </div>
  );
}
