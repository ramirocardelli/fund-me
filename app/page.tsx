'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProjectCard } from '@/components/project-card';
import { FundProjectDialog } from '@/components/fund-project-dialog';
import { lemonSDK } from '@/lib/lemon-sdk-mock';
import { getProjects } from '@/lib/storage';
import { Project } from '@/lib/types';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Heart } from 'lucide-react';

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showFundDialog, setShowFundDialog] = useState(false);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const response = await lemonSDK.authenticate();
        
        if (response.success) {
          setAuthenticated(true);
          setAuthError(null);
          loadProjects();
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
          <Spinner className="h-12 w-12 text-[#00D26B] mx-auto" />
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
            className="w-full bg-[#00D26B] text-black hover:bg-[#00B85C]"
          >
            Reintentar Conexión
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Simple estilo Lemon */}
      <header className="bg-background sticky top-0 z-10 border-b border-border/40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D26B] to-[#00B85C] flex items-center justify-center">
                <Heart className="h-5 w-5 text-black" />
              </div>
              <span className="text-lg font-semibold text-foreground">Fund Me!</span>
            </div>
            
            <Link href="/projects/mine">
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                Mis Proyectos
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6">
        {/* Título simple */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-1">
            Proyectos
          </h1>
          <p className="text-sm text-muted-foreground">
            Apoyá proyectos increíbles
          </p>
        </div>

        {/* Lista de Proyectos */}
        {projects.length === 0 ? (
          <div className="text-center py-16 px-4">
            <div className="bg-card border border-border rounded-2xl p-8 max-w-sm mx-auto">
              <div className="bg-[#00D26B]/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Heart className="h-8 w-8 text-[#00D26B]" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No hay proyectos</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Sé el primero en crear un proyecto
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

        {/* Botón Crear Proyecto - Abajo de la lista */}
        <div className="mt-8 pb-4">
          <Link href="/projects/new">
            <Button 
              variant="outline" 
              className="w-full h-14 border-dashed border-2 border-border hover:border-[#00D26B] hover:bg-[#00D26B]/5 transition-colors"
            >
              <Plus className="h-5 w-5 mr-2" />
              <span>Crear Nuevo Proyecto</span>
            </Button>
          </Link>
        </div>
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
