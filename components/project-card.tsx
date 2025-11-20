'use client';

import { Project } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, TrendingUp } from 'lucide-react';
import Link from 'next/link';

interface ProjectCardProps {
  project: Project;
  onFund: (project: Project) => void;
}

export function ProjectCard({ project, onFund }: ProjectCardProps) {
  const progress = (project.currentAmount / project.goalAmount) * 100;
  const remaining = project.goalAmount - project.currentAmount;

  return (
    <Card className="bg-card border border-border/50 hover:border-secondary/50 transition-all overflow-hidden">
      {/* Header clickeable para ver detalle */}
      <Link href={`/projects/${project.id}`}>
        <div className="p-4 pb-3 cursor-pointer hover:bg-muted/20 transition-colors">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground mb-1 truncate">
                {project.title}
              </h3>
              <p className="text-xs text-muted-foreground">
                por {project.creatorName}
              </p>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
          </div>
        </div>
      </Link>

      {/* Progress y montos */}
      <div className="px-4 pb-4 space-y-3">
        <Progress value={progress} className="h-1.5" />
        
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-secondary">
                ${project.currentAmount.toFixed(0)}
              </span>
              <span className="text-sm text-muted-foreground">USDC</span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              de ${project.goalAmount.toFixed(0)} meta
            </p>
          </div>
          
          {progress < 100 && (
            <div className="text-right">
              <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/10">
                <TrendingUp className="h-3 w-3 text-secondary" />
                <span className="text-xs font-semibold text-secondary">
                  {progress.toFixed(0)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Botón de acción */}
        <Button 
          onClick={() => onFund(project)}
          className="w-full h-11 bg-secondary text-black hover:bg-secondary/90 font-semibold transition-colors"
          disabled={progress >= 100}
        >
          {progress >= 100 ? '✓ Financiado' : 'Apoyar Campaña'}
        </Button>
      </div>
    </Card>
  );
}
